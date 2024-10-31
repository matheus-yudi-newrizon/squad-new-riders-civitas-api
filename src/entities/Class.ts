import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { EducationType } from '../models/enums/EducationType';
import { SchoolShift } from '../models/enums/SchoolShift';
import { SchoolYear } from '../models/enums/SchoolYear';
import { School } from './School';
import { Student } from './Student';

@Entity()
@Unique(['school', 'schoolYear', 'schoolShift', 'educationType', 'name'])
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: SchoolYear,
    nullable: false
  })
  schoolYear: SchoolYear;

  @Column({
    type: 'enum',
    enum: SchoolShift,
    nullable: false
  })
  schoolShift: SchoolShift;

  @Column({
    type: 'enum',
    enum: EducationType,
    nullable: false
  })
  educationType: EducationType;

  @ManyToOne(() => School, school => school.classes, { nullable: false })
  school: School;

  @OneToMany(() => Student, student => student.studentClass)
  students: Student[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
