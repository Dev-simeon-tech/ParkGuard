import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { OrganizationEntity } from './organization.entity';

@Entity('rates')
export class RateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationEntity;

  @OneToOne(() => BranchEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @Column({ type: 'int' })
  durationMinutes!: number;

  @Column({ type: 'int' })
  pricePerDuration!: number;

  @Column({ type: 'int', default: 0 })
  gracePeriodMinutes!: number;

  @Column({ type: 'int', nullable: true })
  dailyMaxAmount!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
