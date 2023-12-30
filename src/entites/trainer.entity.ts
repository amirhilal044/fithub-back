import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client, GhostClient } from './client.entity';
import { Users } from './users.entity';

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, { eager: true })
  @JoinColumn()
  user: Users;

  @ManyToMany(() => Client, (client) => client.trainers)
  @JoinTable()
  clients: Client[];

  @OneToMany(() => GhostClient, (ghostClient) => ghostClient.trainer)
  ghostClients: GhostClient[];
}
