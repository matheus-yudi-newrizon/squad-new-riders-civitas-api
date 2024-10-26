import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TeacherSchool } from './TeacherSchool';

@Entity()
@Unique(['cpf'])
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.teacher)
  teacherSchools: TeacherSchool[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
