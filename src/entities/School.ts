import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { TeacherSchool } from './TeacherSchool';
import { User } from './User';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User, user => user.school)
  administrator: User;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.school)
  teacherSchools: TeacherSchool[];

  @OneToMany(() => Student, student => student.school)
  students: Student[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
