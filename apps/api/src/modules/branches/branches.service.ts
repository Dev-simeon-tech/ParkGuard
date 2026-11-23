import type { CreateBranchBody, UpdateBranchBody } from '@parkguard/schemas';
import type { BranchSummary } from '@parkguard/types';
import { BadRequestException } from '@/common/exceptions';
import { AppDataSource } from '@/db';
import {
  BranchEntity,
  EmployeeBranchEntity,
  ParkingSessionEntity,
  ParkingSessionStatus,
  RateEntity,
} from '@/db/entities';
import { BranchMessages } from './branches.messages';

export class BranchesService {
  async createBranch(organizationId: string, input: CreateBranchBody): Promise<BranchSummary> {
    const branch = await AppDataSource.transaction(async (manager) => {
      const branch = manager.create(BranchEntity, {
        organization: { id: organizationId },
        name: input.name,
        state: input.state,
        address: input.address,
        totalCapacity: input.totalCapacity,
      });
      await manager.save(branch);

      const rate = manager.create(RateEntity, {
        organization: { id: organizationId },
        branch,
        durationMinutes: input.rate.durationMinutes,
        pricePerDuration: input.rate.pricePerDuration,
        gracePeriodMinutes: input.rate.gracePeriodMinutes ?? 0,
        dailyMaxAmount: input.rate.dailyMaxAmount ?? null,
      });
      await manager.save(rate);

      branch.rate = rate;
      return branch;
    });

    return this.serializeBranch(branch, organizationId);
  }

  async listBranches(organizationId: string): Promise<BranchSummary[]> {
    const branches = await BranchEntity.find({
      where: { organization: { id: organizationId } },
      relations: { rate: true },
      order: { createdAt: 'ASC' },
    });
    return Promise.all(
      branches.map((branch) => this.serializeBranch(branch, organizationId)),
    );
  }

  async getBranch(organizationId: string, branchId: string): Promise<BranchSummary> {
    const branch = await this.findBranch(organizationId, branchId);
    return this.serializeBranch(branch, organizationId);
  }

  async updateBranch(
    organizationId: string,
    branchId: string,
    input: UpdateBranchBody,
  ): Promise<void> {
    const branch = await this.findBranch(organizationId, branchId);
    if (input.name !== undefined) {
      branch.name = input.name;
    }
    if (input.state !== undefined) {
      branch.state = input.state;
    }
    if (input.address !== undefined) {
      branch.address = input.address;
    }
    if (input.totalCapacity !== undefined) {
      branch.totalCapacity = input.totalCapacity;
    }
    await branch.save();

    if (input.rate) {
      const rate = branch.rate!;
      if (input.rate.durationMinutes !== undefined) {
        rate.durationMinutes = input.rate.durationMinutes;
      }
      if (input.rate.pricePerDuration !== undefined) {
        rate.pricePerDuration = input.rate.pricePerDuration;
      }
      if (input.rate.gracePeriodMinutes !== undefined) {
        rate.gracePeriodMinutes = input.rate.gracePeriodMinutes;
      }
      if (input.rate.dailyMaxAmount !== undefined) {
        rate.dailyMaxAmount = input.rate.dailyMaxAmount;
      }
      await rate.save();
    }
  }

  async disableBranch(organizationId: string, branchId: string): Promise<void> {
    const branch = await this.findBranch(organizationId, branchId);
    branch.disabledAt = new Date();
    await branch.save();
  }

  async enableBranch(organizationId: string, branchId: string): Promise<void> {
    const branch = await this.findBranch(organizationId, branchId);
    branch.disabledAt = null;
    await branch.save();
  }

  async findBranch(organizationId: string, branchId: string): Promise<BranchEntity> {
    const branch = await BranchEntity.findOne({
      where: { id: branchId, organization: { id: organizationId } },
      relations: { rate: true },
    });
    if (!branch) {
      throw new BadRequestException(BranchMessages.BRANCH_NOT_FOUND);
    }
    return branch;
  }

  private async serializeBranch(
    branch: BranchEntity,
    organizationId: string,
  ): Promise<BranchSummary> {
    const totalMembers = await EmployeeBranchEntity.count({
      where: {
        branch: { id: branch.id },
        organizationUser: {
          organization: { id: organizationId },
          role: { name: 'attendant' },
        },
      },
    });
    const totalActiveSessions = await ParkingSessionEntity.count({
      where: {
        branch: { id: branch.id },
        organization: { id: organizationId },
        status: ParkingSessionStatus.ACTIVE,
      },
    });

    return {
      id: branch.id,
      name: branch.name,
      state: branch.state,
      address: branch.address,
      totalCapacity: branch.totalCapacity,
      status: branch.disabledAt ? 'disabled' : 'active',
      disabledAt: branch.disabledAt ? branch.disabledAt.toISOString() : null,
      totalMembers,
      totalActiveSessions,
      rate: {
        durationMinutes: branch.rate!.durationMinutes,
        pricePerDuration: branch.rate!.pricePerDuration,
        gracePeriodMinutes: branch.rate!.gracePeriodMinutes,
        dailyMaxAmount: branch.rate!.dailyMaxAmount,
      },
      createdAt: branch.createdAt.toISOString(),
      updatedAt: branch.updatedAt.toISOString(),
    };
  }
}
