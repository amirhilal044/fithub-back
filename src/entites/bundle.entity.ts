import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client, GhostClient } from './client.entity';

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
}
