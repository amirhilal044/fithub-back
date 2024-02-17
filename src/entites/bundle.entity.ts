import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client, GhostClient } from './client.entity';
import { SessionEvent } from './session-event.entity';
import { Trainer } from './trainer.entity';

@Entity()
export class Bundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionsNumber: number;

  @Column()
  totalPrice: number;

  @Column()
  description: string;

  @ManyToOne(() => Client, (client) => client.bundles, { nullable: true })
  client: Client | null;

  @ManyToOne(() => GhostClient, (ghostClient) => ghostClient.bundles, {
    nullable: true,
  })
  ghostClient: GhostClient | null;

  @OneToMany(() => SessionEvent, (sessionEvent) => sessionEvent.sessionBundle)
  sessionEvents: SessionEvent[];

  @Column({ default: false })
  done: boolean;

  @Column('int')
  remainingSessions: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.bundles)
  trainer: Trainer;
}
