import { DefaultRoles } from '@parkguard/authorization';
import type { CloseSessionBody, CreateSessionBody, ListSessionsQuery } from '@parkguard/schemas';
import type {
  ParkingSessionSummary,
  PlateRecognitionResponse,
  VehicleDetail,
  VehicleSummary,
  SessionAnalytics,
  AttendantSessionAnalytics,
  SessionRevenueAnalytics,
} from '@parkguard/types';
import { BadRequestException, ForbiddenException } from '@/common/exceptions';
import {
  EmployeeBranchEntity,
  BranchEntity,
  OrganizationUserEntity,
  ParkingSessionEntity,
  ParkingSessionStatus,
  UserEntity,
  VehicleEntity,
} from '@/db/entities';
import { readPhoto } from '@/lib/photo-storage';
import { isRoboflowConfigured, recognizePlate } from '@/lib/roboflow';
import { BranchesService } from '@/modules/branches';
import { SessionMessages } from './sessions.messages';

const DEFAULT_PAGE_SIZE = 20;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DATA_URI_PATTERN = /^data:(image\/(?:jpeg|png));base64,/i;
const MINUTES_PER_DAY = 24 * 60;

export class SessionsService {
  private readonly branchesService = new BranchesService();

  async recognize(
    organizationUser: OrganizationUserEntity,
    branchId: string,
    imageBase64: string,
    mimeType?: 'image/jpeg' | 'image/png',
  ): Promise<PlateRecognitionResponse> {
    await this.assertBranchAccess(organizationUser, branchId);
    if (!isRoboflowConfigured()) {
      throw new BadRequestException('Plate recognition is not configured yet');
    }

    const image = this.decodeBase64Image(imageBase64, mimeType);
    // const photoRef = await savePhoto(image.buffer, image.mimeType);
    const photoRef = ''; // Temporarily disabled saving photos until we have a proper storage solution
    const { plateNumber, confidence } = await recognizePlate(image.base64);

    let matchedSessionId: string | null = null;
    let matchedVehicle: VehicleSummary | null = null;
    if (plateNumber) {
      const activeSession = await ParkingSessionEntity.findOne({
        where: {
          organization: { id: organizationUser.organization.id },
          branch: { id: branchId },
          status: ParkingSessionStatus.ACTIVE,
          vehicle: { plateNumber: this.normalizePlate(plateNumber) },
        },
      });
      const vehicle = await VehicleEntity.findOne({
        where: {
          organization: { id: organizationUser.organization.id },
          plateNumber: this.normalizePlate(plateNumber),
        },
      });
      matchedVehicle = vehicle ? this.serializeVehicle(vehicle) : null;
      matchedSessionId = activeSession?.id ?? null;
    }
    return { photoRef, plateNumber, confidence, matchedSessionId, matchedVehicle };
  }
  async recogniseByPlate(
    plateNumber: string,
    branchId: string,
    organizationUser: OrganizationUserEntity,
  ): Promise<{
    matchedSessionId: string | null;
    matchedVehicle: VehicleSummary | null;
    plateNumber: string;
  }> {
    const activeSession = await ParkingSessionEntity.findOne({
      where: {
        organization: { id: organizationUser.organization.id },
        branch: { id: branchId },
        status: ParkingSessionStatus.ACTIVE,
        vehicle: { plateNumber: this.normalizePlate(plateNumber) },
      },
    });
    const vehicle = await VehicleEntity.findOne({
      where: {
        organization: { id: organizationUser.organization.id },
        plateNumber: this.normalizePlate(plateNumber),
      },
    });
    const matchedVehicle = vehicle ? this.serializeVehicle(vehicle) : null;
    const matchedSessionId = activeSession?.id ?? null;

    return { matchedSessionId, matchedVehicle, plateNumber };
  }

  async createSession(
    organizationUser: OrganizationUserEntity,
    userId: string,
    input: CreateSessionBody,
  ): Promise<ParkingSessionSummary> {
    await this.assertBranchAccess(organizationUser, input.branchId);
    const branch = await this.branchesService.findBranch(
      organizationUser.organization.id,
      input.branchId,
    );

    // if (input.photoRef) {
    //   this.assertValidPhotoRef(input.photoRef);
    // }

    const plateNumber = this.normalizePlate(input.plateNumber);

    const existingActiveSession = await ParkingSessionEntity.findOne({
      where: {
        organization: { id: organizationUser.organization.id },
        status: ParkingSessionStatus.ACTIVE,
        vehicle: { plateNumber },
      },
    });
    if (existingActiveSession) {
      throw new BadRequestException(SessionMessages.ACTIVE_SESSION_EXISTS);
    }

    let vehicle = await VehicleEntity.findOne({
      where: { organization: { id: organizationUser.organization.id }, plateNumber },
    });
    if (!vehicle) {
      vehicle = VehicleEntity.create({
        organization: { id: organizationUser.organization.id },
        plateNumber,
        color: input.color ?? null,
        model: input.model ?? null,
      });
      await vehicle.save();
    } else if (input.color || input.model) {
      vehicle.color = input.color ?? vehicle.color;
      vehicle.model = input.model ?? vehicle.model;
      await vehicle.save();
    }

    const session = ParkingSessionEntity.create({
      organization: { id: organizationUser.organization.id },
      branch,
      vehicle,
      status: ParkingSessionStatus.ACTIVE,
      entryAt: new Date(),
      entryPhotoPath: input.photoRef ?? null,
      entryPlateConfidence: input.confidence ?? null,
      entryRecordedBy: { id: userId } as UserEntity,
    });
    await session.save();

    return this.serializeSession(
      await this.findSession(organizationUser.organization.id, session.id),
    );
  }

  async closeSession(
    organizationUser: OrganizationUserEntity,
    userId: string,
    sessionId: string,
    input: CloseSessionBody,
  ): Promise<ParkingSessionSummary> {
    const session = await this.findSession(organizationUser.organization.id, sessionId);
    if (session.status === ParkingSessionStatus.COMPLETED) {
      throw new BadRequestException(SessionMessages.SESSION_ALREADY_CLOSED);
    }
    await this.assertBranchAccess(organizationUser, session.branch.id);

    // if (input.photoRef) {
    //   this.assertValidPhotoRef(input.photoRef);
    // }

    const branch = await this.branchesService.findBranch(
      organizationUser.organization.id,
      session.branch.id,
    );
    const rate = branch.rate!;

    const exitAt = new Date();
    const durationMinutes = Math.max(
      0,
      Math.floor((exitAt.getTime() - session.entryAt.getTime()) / 60_000),
    );
    const billableMinutes = Math.max(0, durationMinutes - rate.gracePeriodMinutes);
    const chargeFor = (minutes: number) => {
      if (minutes <= 0) return 0;
      const amount = Math.ceil(minutes / rate.durationMinutes) * rate.pricePerDuration;
      return rate.dailyMaxAmount !== null ? Math.min(amount, rate.dailyMaxAmount) : amount;
    };
    const fullDays = Math.floor(billableMinutes / MINUTES_PER_DAY);
    const remainder = billableMinutes % MINUTES_PER_DAY;
    const totalAmount = fullDays * chargeFor(MINUTES_PER_DAY) + chargeFor(remainder);

    session.status = ParkingSessionStatus.COMPLETED;
    session.exitAt = exitAt;
    session.exitPhotoPath = input.photoRef ?? null;
    session.exitPlateConfidence = input.confidence ?? null;
    session.exitRecordedBy = { id: userId } as UserEntity;
    session.durationMinutes = durationMinutes;
    session.billedDurationMinutes = rate.durationMinutes;
    session.billedPricePerDuration = rate.pricePerDuration;
    session.billedGracePeriodMinutes = rate.gracePeriodMinutes;
    session.billedDailyMaxAmount = rate.dailyMaxAmount;
    session.totalAmount = totalAmount;
    await session.save();

    return this.serializeSession(
      await this.findSession(organizationUser.organization.id, sessionId),
    );
  }

  async listSessions(
    organizationId: string,
    query: ListSessionsQuery,
  ): Promise<{ sessions: ParkingSessionSummary[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;

    const qb = ParkingSessionEntity.createQueryBuilder('session')
      .leftJoinAndSelect('session.branch', 'branch')
      .leftJoinAndSelect('session.vehicle', 'vehicle')
      .leftJoinAndSelect('session.entryRecordedBy', 'entryRecordedBy')
      .leftJoinAndSelect('session.exitRecordedBy', 'exitRecordedBy')
      .where('session.organization_id = :organizationId', { organizationId });

    if (query.status) {
      qb.andWhere('session.status = :status', { status: query.status });
    }
    if (query.branchId) {
      qb.andWhere('branch.id = :branchId', { branchId: query.branchId });
    }
    if (query.dateFrom) {
      qb.andWhere('session.entry_at >= :dateFrom', { dateFrom: `${query.dateFrom}T00:00:00.000Z` });
    }
    if (query.dateTo) {
      qb.andWhere('session.entry_at <= :dateTo', { dateTo: `${query.dateTo}T23:59:59.999Z` });
    }
    if (query.plateNumber) {
      qb.andWhere('vehicle.plate_number ILIKE :plateNumber', {
        plateNumber: `%${this.normalizePlate(query.plateNumber)}%`,
      });
    }

    const [sessions, total] = await qb
      .orderBy('session.entryAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      sessions: sessions.map((session) => this.serializeSession(session)),
      total,
      page,
      limit,
    };
  }

  async getAnalytics(organizationId: string, date: string): Promise<SessionAnalytics> {
    const dateFrom = `${date}T00:00:00.000Z`;
    const dateTo = `${date}T23:59:59.999Z`;

    const [currentlyParked, totalCarsIn, exitStats] = await Promise.all([
      ParkingSessionEntity.createQueryBuilder('session')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.status = :status', { status: ParkingSessionStatus.ACTIVE })
        .getCount(),
      ParkingSessionEntity.createQueryBuilder('session')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.entry_at >= :dateFrom', { dateFrom })
        .andWhere('session.entry_at <= :dateTo', { dateTo })
        .getCount(),
      ParkingSessionEntity.createQueryBuilder('session')
        .select('COUNT(*)', 'totalCarsOut')
        .addSelect('COALESCE(SUM(session.total_amount), 0)', 'totalRevenue')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.exit_at >= :dateFrom', { dateFrom })
        .andWhere('session.exit_at <= :dateTo', { dateTo })
        .getRawOne<{ totalCarsOut: string; totalRevenue: string }>(),
    ]);

    return {
      date,
      currentlyParked,
      totalCarsIn,
      totalCarsOut: Number(exitStats?.totalCarsOut ?? 0),
      totalRevenue: Number(exitStats?.totalRevenue ?? 0),
    };
  }

  async getRevenueAnalytics(
    organizationId: string,
    date: string,
  ): Promise<SessionRevenueAnalytics> {
    const dateFrom = `${date}T00:00:00.000Z`;
    const dateTo = `${date}T23:59:59.999Z`;
    const selectedDate = new Date(`${date}T12:00:00.000Z`);
    const previousWeekEnd = new Date(selectedDate);
    previousWeekEnd.setUTCDate(previousWeekEnd.getUTCDate() - 1);
    const previousWeekStart = new Date(previousWeekEnd);
    previousWeekStart.setUTCDate(previousWeekStart.getUTCDate() - 6);
    const previousWeekFrom = `${previousWeekStart.toISOString().slice(0, 10)}T00:00:00.000Z`;
    const previousWeekTo = `${previousWeekEnd.toISOString().slice(0, 10)}T23:59:59.999Z`;

    const [branchRevenue, activeBranches, activeAttendants, previousRevenue, weeklyTrend] = await Promise.all([
      BranchEntity.createQueryBuilder('branch')
        .leftJoin(
          ParkingSessionEntity,
          'session',
          'session.branch_id = branch.id AND session.exit_at >= :dateFrom AND session.exit_at <= :dateTo',
          { dateFrom, dateTo },
        )
        .select('branch.id', 'branchId')
        .addSelect('branch.name', 'branchName')
        .addSelect('COALESCE(SUM(session.total_amount), 0)', 'expectedRevenue')
        .where('branch.organization_id = :organizationId', { organizationId })
        .groupBy('branch.id')
        .addGroupBy('branch.name')
        .orderBy('branch.name', 'ASC')
        .getRawMany<{ branchId: string; branchName: string; expectedRevenue: string }>(),
      BranchEntity.createQueryBuilder('branch')
        .where('branch.organization_id = :organizationId', { organizationId })
        .andWhere('branch.disabled_at IS NULL')
        .getCount(),
      OrganizationUserEntity.createQueryBuilder('organizationUser')
        .innerJoin('organizationUser.user', 'user')
        .innerJoin('organizationUser.role', 'role')
        .where('organizationUser.organization_id = :organizationId', { organizationId })
        .andWhere('organizationUser.accepted_at IS NOT NULL')
        .andWhere('organizationUser.disabled_at IS NULL')
        .andWhere('user.is_active = true')
        .andWhere('role.name = :attendantRole', { attendantRole: DefaultRoles.attendant.name })
        .getCount(),
      ParkingSessionEntity.createQueryBuilder('session')
        .select('COALESCE(SUM(session.total_amount), 0)', 'totalRevenue')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.exit_at >= :previousWeekFrom', { previousWeekFrom })
        .andWhere('session.exit_at <= :previousWeekTo', { previousWeekTo })
        .getRawOne<{ totalRevenue: string }>(),
      Promise.all(
        Array.from({ length: 7 }, (_, index) => {
          const trendDate = new Date(selectedDate);
          trendDate.setUTCDate(trendDate.getUTCDate() - (6 - index));
          const trendDateString = trendDate.toISOString().slice(0, 10);
          const trendFrom = `${trendDateString}T00:00:00.000Z`;
          const trendTo = `${trendDateString}T23:59:59.999Z`;
          return ParkingSessionEntity.createQueryBuilder('session')
            .select('COALESCE(SUM(session.total_amount), 0)', 'revenue')
            .where('session.organization_id = :organizationId', { organizationId })
            .andWhere('session.exit_at >= :trendFrom', { trendFrom })
            .andWhere('session.exit_at <= :trendTo', { trendTo })
            .getRawOne<{ revenue: string }>()
            .then((row) => ({
              date: trendDateString,
              revenue: Number(row?.revenue ?? 0),
            }));
        }),
      ),
    ]);

    const branches = branchRevenue.map((branch) => ({
      branchId: branch.branchId,
      branchName: branch.branchName,
      expectedRevenue: Number(branch.expectedRevenue),
    }));

    const previousWeekTotalExpectedRevenue = Number(previousRevenue?.totalRevenue ?? 0);

    return {
      date,
      branches,
      totalExpectedRevenue: branches.reduce((total, branch) => total + branch.expectedRevenue, 0),
      activeBranches,
      activeAttendants,
      previousWeekTotalExpectedRevenue,
      previousWeek: {
        totalExpectedRevenue: previousWeekTotalExpectedRevenue,
        activeBranches,
        activeAttendants,
      },
      weeklyTrend,
    };
  }

  async getAttendantAnalytics(
    organizationId: string,
    attendantId: string,
    date: string,
  ): Promise<AttendantSessionAnalytics> {
    const dateFrom = `${date}T00:00:00.000Z`;
    const dateTo = `${date}T23:59:59.999Z`;
    const latestAttendantActivity = `
      GREATEST(
        CASE WHEN entryRecordedBy.id = :attendantId THEN session.entry_at ELSE '-infinity'::timestamptz END,
        CASE WHEN exitRecordedBy.id = :attendantId THEN session.exit_at ELSE '-infinity'::timestamptz END
      )
    `;

    const [totalCarsIn, totalCarsOut, recentSessions] = await Promise.all([
      ParkingSessionEntity.createQueryBuilder('session')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.entry_recorded_by = :attendantId', { attendantId })
        .andWhere('session.entry_at >= :dateFrom', { dateFrom })
        .andWhere('session.entry_at <= :dateTo', { dateTo })
        .getCount(),
      ParkingSessionEntity.createQueryBuilder('session')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('session.exit_recorded_by = :attendantId', { attendantId })
        .andWhere('session.exit_at >= :dateFrom', { dateFrom })
        .andWhere('session.exit_at <= :dateTo', { dateTo })
        .getCount(),
      ParkingSessionEntity.createQueryBuilder('session')
        .leftJoinAndSelect('session.branch', 'branch')
        .leftJoinAndSelect('session.vehicle', 'vehicle')
        .leftJoinAndSelect('session.entryRecordedBy', 'entryRecordedBy')
        .leftJoinAndSelect('session.exitRecordedBy', 'exitRecordedBy')
        .addSelect(latestAttendantActivity, 'latestAttendantActivity')
        .where('session.organization_id = :organizationId', { organizationId })
        .andWhere('(entryRecordedBy.id = :attendantId OR exitRecordedBy.id = :attendantId)', {
          attendantId,
        })
        .orderBy('latestAttendantActivity', 'DESC')
        .take(5)
        .getMany(),
    ]);

    return {
      date,
      attendantId,
      totalCarsIn,
      totalCarsOut,
      recentSessions: recentSessions.map((session) => this.serializeSession(session)),
    };
  }

  async getSession(organizationId: string, sessionId: string): Promise<ParkingSessionSummary> {
    return this.serializeSession(await this.findSession(organizationId, sessionId));
  }

  async getPhoto(
    organizationId: string,
    sessionId: string,
    type: 'entry' | 'exit',
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const session = await this.findSession(organizationId, sessionId);
    const filename = type === 'entry' ? session.entryPhotoPath : session.exitPhotoPath;
    if (!filename) {
      throw new BadRequestException(SessionMessages.PHOTO_NOT_FOUND);
    }
    const buffer = await readPhoto(filename);
    const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return { buffer, mimeType };
  }

  async listVehicles(organizationId: string, search?: string): Promise<VehicleSummary[]> {
    const qb = VehicleEntity.createQueryBuilder('vehicle').where(
      'vehicle.organization_id = :organizationId',
      { organizationId },
    );
    if (search) {
      qb.andWhere('vehicle.plate_number ILIKE :search', {
        search: `%${this.normalizePlate(search)}%`,
      });
    }
    const vehicles = await qb.orderBy('vehicle.createdAt', 'DESC').getMany();
    return vehicles.map((vehicle) => this.serializeVehicle(vehicle));
  }

  async getVehicle(organizationId: string, vehicleId: string): Promise<VehicleDetail> {
    const vehicle = await VehicleEntity.findOne({
      where: { id: vehicleId, organization: { id: organizationId } },
    });
    if (!vehicle) {
      throw new BadRequestException(SessionMessages.VEHICLE_NOT_FOUND);
    }

    const stats = await ParkingSessionEntity.createQueryBuilder('session')
      .select('COUNT(*)', 'visitCount')
      .addSelect('COALESCE(SUM(session.total_amount), 0)', 'totalBilled')
      .addSelect('MAX(session.exit_at)', 'lastSeenAt')
      .where('session.vehicle_id = :vehicleId', { vehicleId })
      .getRawOne<{ visitCount: string; totalBilled: string; lastSeenAt: Date | null }>();

    return {
      ...this.serializeVehicle(vehicle),
      visitCount: Number(stats?.visitCount ?? 0),
      totalBilled: Number(stats?.totalBilled ?? 0),
      lastSeenAt: stats?.lastSeenAt ? stats.lastSeenAt.toISOString() : null,
    };
  }

  private async findSession(
    organizationId: string,
    sessionId: string,
  ): Promise<ParkingSessionEntity> {
    const session = await ParkingSessionEntity.findOne({
      where: { id: sessionId, organization: { id: organizationId } },
      relations: { branch: true, vehicle: true, entryRecordedBy: true, exitRecordedBy: true },
    });
    if (!session) {
      throw new BadRequestException(SessionMessages.SESSION_NOT_FOUND);
    }
    return session;
  }

  private async assertBranchAccess(
    organizationUser: OrganizationUserEntity,
    branchId: string,
  ): Promise<void> {
    const hasAnyAssignment = await EmployeeBranchEntity.findOne({
      where: { organizationUser: { id: organizationUser.id } },
    });
    if (!hasAnyAssignment) {
      return;
    }

    const isAssignedToBranch = await EmployeeBranchEntity.findOne({
      where: { organizationUser: { id: organizationUser.id }, branch: { id: branchId } },
    });
    if (!isAssignedToBranch) {
      throw new ForbiddenException(SessionMessages.BRANCH_NOT_ASSIGNED);
    }
  }

  // private assertValidPhotoRef(photoRef: string): void {
  //   if (!isValidPhotoFilename(photoRef)) {
  //     throw new BadRequestException(SessionMessages.INVALID_PHOTO_REFERENCE);
  //   }
  // }

  private normalizePlate(plateNumber: string): string {
    return plateNumber
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }

  private decodeBase64Image(
    imageBase64: string,
    fallbackMimeType?: 'image/jpeg' | 'image/png',
  ): { base64: string; buffer: Buffer; mimeType: 'image/jpeg' | 'image/png' } {
    const trimmed = imageBase64.trim();
    const dataUriMatch = DATA_URI_PATTERN.exec(trimmed);
    if (trimmed.startsWith('data:') && !dataUriMatch) {
      throw new BadRequestException(SessionMessages.IMAGE_INVALID);
    }
    const base64 = dataUriMatch ? trimmed.replace(DATA_URI_PATTERN, '') : trimmed;
    const mimeType =
      (dataUriMatch?.[1].toLowerCase() as 'image/jpeg' | 'image/png' | undefined) ??
      fallbackMimeType ??
      'image/jpeg';
    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length === 0) {
      throw new BadRequestException(SessionMessages.IMAGE_REQUIRED);
    }
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new BadRequestException(SessionMessages.IMAGE_TOO_LARGE);
    }

    return { base64, buffer, mimeType };
  }

  private serializeVehicle(vehicle: VehicleEntity): VehicleSummary {
    return {
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      color: vehicle.color,
      model: vehicle.model,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  private serializeSession(session: ParkingSessionEntity): ParkingSessionSummary {
    return {
      id: session.id,
      status: session.status,
      branch: { id: session.branch.id, name: session.branch.name },
      vehicle: {
        id: session.vehicle.id,
        plateNumber: session.vehicle.plateNumber,
        color: session.vehicle.color,
        model: session.vehicle.model,
      },
      entryAt: session.entryAt.toISOString(),
      exitAt: session.exitAt ? session.exitAt.toISOString() : null,
      hasEntryPhoto: Boolean(session.entryPhotoPath),
      hasExitPhoto: Boolean(session.exitPhotoPath),
      entryConfidence: session.entryPlateConfidence,
      exitConfidence: session.exitPlateConfidence,
      entryRecordedBy: {
        id: session.entryRecordedBy.id,
        firstName: session.entryRecordedBy.firstName,
        lastName: session.entryRecordedBy.lastName,
      },
      exitRecordedBy: session.exitRecordedBy
        ? {
            id: session.exitRecordedBy.id,
            firstName: session.exitRecordedBy.firstName,
            lastName: session.exitRecordedBy.lastName,
          }
        : null,
      durationMinutes: session.durationMinutes,
      totalAmount: session.totalAmount,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }
}
