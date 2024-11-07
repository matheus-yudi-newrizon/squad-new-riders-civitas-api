import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './Class';
import { School } from './School';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  fullName: string;

  @Column({ nullable: false, unique: true })
  document: string;

  @Column({ nullable: false, length: 20, unique: true })
  registrationNumber: string;

  @ManyToOne(() => Class, { nullable: false })
  @JoinColumn({ name: 'studentClassId' })
  studentClass: Class;

  @ManyToOne(() => School, { nullable: false })
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @Column({ nullable: false })
  cpfGuardian: string;

  @BeforeInsert()
  /**
   * Remove caracteres de máscara (pontos e traços) dos campos `document` e `cpfGuardian`.
   *
   * Este método é chamado automaticamente antes de inserir um novo estudante.
   * Ele garante que os valores dos campos `document` e `cpfGuardian` estejam sem qualquer
   * formatação antes de serem salvos.
   *
   */
  public unmaskFields(): void {
    this.document = this.document.replace(/[.-]/g, '');
    this.cpfGuardian = this.cpfGuardian.replace(/[.-]/g, '');
  }
}
