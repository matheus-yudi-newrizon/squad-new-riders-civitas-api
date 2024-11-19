import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { TeacherClass } from './TeacherClass';
import { TeacherSchool } from './TeacherSchool';

@Entity()
@Unique(['cpf'])
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  cpf: string;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.teacher)
  teacherSchools: TeacherSchool[];

  @OneToMany(() => TeacherClass, teacherClass => teacherClass.teacher)
  teacherClasses: TeacherClass[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  /**
   * Remove caracteres de máscara (pontos e traços) do campo `cpf`.
   *
   * Este método é chamado automaticamente antes de inserir um novo professor ou atualizar seus dados.
   * Ele garante que o valor do campo `cpf` esteja sem qualquer
   * formatação antes de ser salvo.
   */
  public unmaskCpf(): void {
    this.cpf = this.cpf.replace(/[.-]/g, '');
  }
}
