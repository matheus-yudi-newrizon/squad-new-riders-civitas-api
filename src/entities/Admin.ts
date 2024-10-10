import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('admins')
@Unique(['email'])
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: ['admin', 'free'], default: 'free' })
  acessLevel: string;

  @Column({ enum: ['free'] })
  accountType: string;
}
