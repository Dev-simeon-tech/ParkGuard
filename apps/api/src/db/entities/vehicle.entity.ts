import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('vehicles')
@Unique(['organization', 'plateNumber'])
export class VehicleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationEntity;

  @Column({ type: 'varchar' })
  plateNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  color!: string | null;

  @Column({ type: 'varchar', nullable: true })
  model!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
