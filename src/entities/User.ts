import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @OneToOne(() => School, school => school.administrator, { nullable: false })
  school: School;

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
