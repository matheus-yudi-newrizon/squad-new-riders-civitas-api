import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';
import { Class } from './Class';

@Entity()
export class TeacherClass {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, teacher => teacher.teacherClasses, { nullable: false })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @ManyToOne(() => Class, classEntity => classEntity.teacherClasses, { nullable: false })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
