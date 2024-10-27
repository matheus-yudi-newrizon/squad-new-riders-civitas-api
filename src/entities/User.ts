import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { generateAndHashPassword } from '../utils/generateAndHashPassword';
import { School } from './School';

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

  @ManyToOne(() => School, { nullable: true })
  school: School | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  public rawPassword: string;

  @BeforeInsert()
  public async encryptPassword(): Promise<void> {
    const { hashedPassword, rawPassword } = await generateAndHashPassword();
    this.password = hashedPassword;
    this.rawPassword = rawPassword;
  }
}
