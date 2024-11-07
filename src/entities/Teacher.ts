import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { TeacherSchool } from './TeacherSchool';
import { TeacherClass } from './TeacherClass';

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

  @BeforeInsert()
  /**
   * Remove caracteres de máscara (pontos e traços) do campo `cpf`.
   *
   * Este método é chamado automaticamente antes de inserir um novo professor.
   * Ele garante que o valor do campo `cpf` esteja sem qualquer
   * formatação antes de ser salvo.
   */
  public unmaskCpf(): void {
    this.cpf = this.cpf.replace(/[.-]/g, '');
  }
}
