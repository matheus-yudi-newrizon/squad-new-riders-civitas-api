import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Class } from './Class';
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

  @OneToOne(() => User, user => user.school, { nullable: true })
  @JoinColumn()
  administrator: User;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.school)
  teacherSchools: TeacherSchool[];

  @OneToMany(() => Class, classEntity => classEntity.school)
  classes: Class[];

  @OneToMany(() => Student, student => student.school)
  students: Student[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
