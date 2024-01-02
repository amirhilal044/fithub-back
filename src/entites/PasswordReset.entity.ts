import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  resetToken: string;

  @Column()
  resetTokenExpiry: Date;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;
}
