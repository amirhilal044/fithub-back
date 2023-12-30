import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainer } from './trainer.entity';
import { Users } from './users.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, { eager: true, nullable: true })
  @JoinColumn()
  user: Users | null;

  @ManyToMany(() => Trainer, (trainer) => trainer.clients)
  @JoinTable()
  trainers: Trainer[];

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;
}

@Entity()
export class GhostClient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.ghostClients)
  trainer: Trainer;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;
}
