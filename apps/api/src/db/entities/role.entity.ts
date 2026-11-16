import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, type: 'varchar' })
  name!: string;

  @Column({ nullable: true, type: 'varchar' })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
