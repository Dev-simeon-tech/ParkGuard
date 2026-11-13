import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BranchEntity } from './branch.entity';
import { OrganizationUserEntity } from './organization-user.entity';

@Entity('employee_branches')
@Unique(['organizationUser', 'branch'])
export class EmployeeBranchEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => OrganizationUserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_user_id' })
  organizationUser!: OrganizationUserEntity;

  @ManyToOne(() => BranchEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch!: BranchEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
