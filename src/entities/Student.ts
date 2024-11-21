import { cpf } from 'cpf-cnpj-validator';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  /**
   * Remove caracteres de máscara (pontos e traços) dos campos `document` e `cpfGuardian`.
   *
   * Este método é chamado automaticamente antes de inserir um novo estudante ou atualizar um existente.
   * Ele garante que os valores dos campos `document` e `cpfGuardian` estejam sem qualquer
   * formatação antes de serem salvos.
   *
   */
  public unmaskFields(): void {
    this.document = this.document.replace(/[.-]/g, '');
    this.cpfGuardian = this.cpfGuardian.replace(/[.-]/g, '');
  }

  @AfterLoad()
  /**
   * Adiciona máscara de CPF aos campos `document` e `cpfGuardian`.
   *
   * Este método é chamado automaticamente após carregar um estudante do banco de dados.
   * Ele garante que os valores dos campos `document` e `cpfGuardian` estejam formatados
   * corretamente para exibição.
   *
   */
  public maskFields(): void {
    if (cpf.isValid(this.document)) {
      this.document = this.document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else this.document = this.document;
    this.cpfGuardian = this.cpfGuardian.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
