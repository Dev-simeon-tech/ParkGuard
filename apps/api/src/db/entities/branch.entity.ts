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
import { OrganizationEntity } from './organization.entity';
import { RateEntity } from './rate.entity';

@Entity('branches')
export class BranchEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationEntity;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  state!: string;

  @Column({ type: 'varchar' })
  address!: string;

  @Column({ type: 'int' })
  totalCapacity!: number;

  @Column({ type: 'timestamptz', nullable: true })
  disabledAt!: Date | null;

  @OneToOne(() => RateEntity, (rate) => rate.branch)
  rate?: RateEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
