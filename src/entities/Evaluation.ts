import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student, Teacher } from '../entities';
import { EvaluationScore } from '../models';

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

  @ManyToOne(() => Student, { nullable: false, onDelete: 'CASCADE' })
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

  @Column({ type: 'varchar', nullable: false })
  label: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
