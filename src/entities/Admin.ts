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
    enum: ['admin'],
    default: 'admin'
  })
  accessLevel: string;

  @Column({
    type: 'enum',
    enum: ['free', 'premium'],
    default: 'free'
  })
  accountType: string;
}
