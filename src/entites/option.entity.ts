import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblOption' })
export class Options {
  @PrimaryGeneratedColumn('increment')
  optionId: number;

  @Column({ type: 'text' })
  optionType: string;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'text' })
  optionValue: string;

  @Column({ type: 'text', nullable: true })
  info: string;

  @Column({
    type: 'text',
    default: '',
  })
  fts: string;
}
