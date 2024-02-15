import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bundle } from './bundle.entity';

@Entity()
export class SessionEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  done: boolean;

  @ManyToOne(() => Bundle, (bundle) => bundle.sessionEvents, {
    nullable: false,
  })
  sessionBundle: Bundle;

  @Column('timestamp')
  startDateTime: Date;

  @Column('timestamp')
  endDateTime: Date;

  @Column('text')
  description: string;

  @Column('text')
  location: string;
}
