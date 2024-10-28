import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Teacher } from './Teacher';
import { TeacherSchool } from './TeacherSchool';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User, user => user.school, { nullable: false })
  administrator: User;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.school)
  teacherSchools: TeacherSchool[];

  @ManyToMany(() => Teacher, teacher => teacher.teacherSchools)
  @JoinTable()
  teachers: Teacher[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
