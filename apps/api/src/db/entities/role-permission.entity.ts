import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity('role_permissions')
@Unique(['role', 'permission'])
export class RolePermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RoleEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(() => PermissionEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
