import bcrypt from 'bcryptjs';
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { School } from '../entities';

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

  /**
   * Método executado automaticamente antes de inserir um novo registro no banco de dados.
   * Ele criptografa a senha do administrador para segurança.
   *
   * @returns Uma promessa que resolve quando a senha é criptografada.
   */
  @BeforeInsert()
  public async encryptPassword(): Promise<void> {
    const fixedPassword: string = '22345511';
    const hashedPassword: string = await bcrypt.hash(fixedPassword, 10);
    this.password = hashedPassword;
  }
}
