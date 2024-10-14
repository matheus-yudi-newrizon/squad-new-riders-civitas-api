import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { generateAndHashPassword } from '../utils/generateAndHashPassword';

@Entity()
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

  public rawPassword: string;

  @BeforeInsert()
  public async encryptPassword(): Promise<void> {
    const { hashedPassword, rawPassword } = await generateAndHashPassword();
    this.password = hashedPassword;
    this.rawPassword = rawPassword;
  }
}
