import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SchoolYear } from '../enums/SchoolYear';
import { SchoolShift } from '../enums/SchoolShift';
import { EducationType } from '../enums/EducationType';

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
}
