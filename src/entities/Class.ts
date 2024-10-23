import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EducationType } from '../enums/EducationType';
import { SchoolShift } from '../enums/SchoolShift';
import { SchoolYear } from '../enums/SchoolYear';
import { Student } from './Student';

@Entity()
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

  @OneToMany(() => Student, student => student.class)
  students: Student[];
}
