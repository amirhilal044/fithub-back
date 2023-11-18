import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: number;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  email: string;

  @Column('text')
  password: string;


  @Column({
    type: 'integer'
  })
  userTypeId: number;

  
  // @Column({
  //   type: 'text'
  // })
  // salt?: string;

}
