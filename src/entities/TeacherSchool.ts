import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { School, Teacher } from '../entities';

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
