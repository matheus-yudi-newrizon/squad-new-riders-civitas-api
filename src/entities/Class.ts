import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { School, Student, TeacherClass } from '../entities';
import { EducationType, SchoolShift, SchoolYear } from '../models';

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

  @OneToMany(() => TeacherClass, teacherClass => teacherClass.class)
  teacherClasses: TeacherClass[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
