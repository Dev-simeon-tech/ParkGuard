import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';
import { VehicleEntity } from './vehicle.entity';

export enum ParkingSessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('parking_sessions')
@Index(['organization', 'branch', 'status'])
@Index(['organization', 'entryAt'])
export class ParkingSessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationEntity;

  @ManyToOne(() => BranchEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @ManyToOne(() => VehicleEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: VehicleEntity;

  @Column({ type: 'enum', enum: ParkingSessionStatus, default: ParkingSessionStatus.ACTIVE })
  status!: ParkingSessionStatus;

  @Column({ type: 'timestamptz' })
  entryAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  exitAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  entryPhotoPath!: string | null;

  @Column({ type: 'varchar', nullable: true })
  exitPhotoPath!: string | null;

  @Column({ type: 'real', nullable: true })
  entryPlateConfidence!: number | null;

  @Column({ type: 'real', nullable: true })
  exitPlateConfidence!: number | null;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'entry_recorded_by' })
  entryRecordedBy!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'exit_recorded_by' })
  exitRecordedBy!: UserEntity | null;

  @Column({ type: 'int', nullable: true })
  durationMinutes!: number | null;

  @Column({ type: 'int', nullable: true })
  billedDurationMinutes!: number | null;

  @Column({ type: 'int', nullable: true })
  billedPricePerDuration!: number | null;

  @Column({ type: 'int', nullable: true })
  billedGracePeriodMinutes!: number | null;

  @Column({ type: 'int', nullable: true })
  billedDailyMaxAmount!: number | null;

  @Column({ type: 'int', nullable: true })
  totalAmount!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
