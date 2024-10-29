import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';
import { School } from './School';

@Entity()
@Unique(['teacher', 'school'])
export class TeacherSchool {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, teacher => teacher.teacherSchools)
  teacher: Teacher;

  @ManyToOne(() => School, school => school.teacherSchools)
  school: School;

  @Column({ nullable: false })
  registrationNumber: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
