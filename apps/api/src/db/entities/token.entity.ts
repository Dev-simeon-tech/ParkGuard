import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum TokenType {
  REFRESH = 'refresh',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  INVITE = 'invite',
}

@Entity('tokens')
export class TokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  key!: string;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'enum', enum: TokenType })
  type!: TokenType;

  @Column({ nullable: true, type: 'varchar' })
  email!: string | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity | null;

  @Column({ nullable: true, type: 'jsonb' })
  metadata!: Record<string, unknown> | null;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  usedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
