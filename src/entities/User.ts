import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert } from 'typeorm';
import { generateAndHashPassword } from '../utils/generateAndHashPassword';

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user'
  })
  accessLevel: string;

  @Column({
    type: 'enum',
    enum: ['free', 'premium'],
    default: 'free'
  })
  accountType: string;

  @BeforeInsert()
  public async encryptPassword(): Promise<void> {
    const { hashedPassword } = await generateAndHashPassword();
    this.password = hashedPassword;
  }
}
