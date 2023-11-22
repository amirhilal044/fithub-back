import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainer } from './trainer.entity';
import { Users } from './users.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users,{ eager: true })
  @JoinColumn()
  user: Users;

  @ManyToMany(() => Trainer, (trainer) => trainer.clients)
  @JoinTable()
  trainers: Trainer[];
}
