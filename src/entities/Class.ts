import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { SchoolYear } from '../enums/SchoolYear';
import { SchoolShift } from '../enums/SchoolShift';
import { EducationType } from '../enums/EducationType';
import { School } from './School';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
