import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Class, Teacher } from '../entities';

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
