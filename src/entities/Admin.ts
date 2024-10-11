import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('admins')
@Unique(['email'])
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'free'],
    default: 'free'
  })
  acessLevel: string;

  @Column({
    type: 'enum',
    enum: ['free'],
    default: 'free'
  })
  accountType: string;
}
