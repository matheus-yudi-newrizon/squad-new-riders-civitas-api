import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Teacher } from './Teacher';
import { Student } from './Student';
import { EvaluationScore } from '../models/enums/EvaluationScore';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, { nullable: true, onDelete: 'SET NULL' })
  teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  teacherId: number;

  @Column({ type: 'varchar', nullable: true })
  teacherName: string;

  @ManyToOne(() => Student, { nullable: false })
  student: Student;

  @Column({ type: 'enum', enum: EvaluationScore, nullable: false })
  selfAwareness: EvaluationScore;

  @Column({ type: 'enum', enum: EvaluationScore, nullable: false })
  empathy: EvaluationScore;

  @Column({ type: 'enum', enum: EvaluationScore, nullable: false })
  communication: EvaluationScore;

  @Column({ type: 'enum', enum: EvaluationScore, nullable: false })
  teamwork: EvaluationScore;

  @Column({ type: 'enum', enum: EvaluationScore, nullable: false })
  autonomy: EvaluationScore;

  @Column({ type: 'varchar', length: 3000, nullable: false })
  teacherComments: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
