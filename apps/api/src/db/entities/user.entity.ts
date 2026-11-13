import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ unique: true, type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  phoneNumber!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  emailVerifiedAt!: Date | null;

  @Column({ default: true, type: 'boolean' })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
