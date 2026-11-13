import {
  BaseEntity,
  CreateDateColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('organization_users')
@Unique(['organization', 'user'])
export class OrganizationUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => RoleEntity, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @Column({ nullable: true, type: 'timestamptz' })
  acceptedAt!: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  disabledAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
