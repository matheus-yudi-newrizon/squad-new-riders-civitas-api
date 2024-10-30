import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { TeacherSchool } from './TeacherSchool';
import { Class } from './Class';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => User, user => user.school, { nullable: false })
  @JoinColumn()
  administrator: User;

  @OneToMany(() => TeacherSchool, teacherSchool => teacherSchool.school)
  teacherSchools: TeacherSchool[];

  @OneToMany(() => Class, classEntity => classEntity.school)
  classes: Class[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
