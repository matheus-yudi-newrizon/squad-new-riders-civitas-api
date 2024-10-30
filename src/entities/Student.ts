import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './Class';
import { School } from './School';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  fullName: string;

  @Column({ nullable: false, unique: true })
  document: string;

  @Column({ nullable: false, length: 20, unique: true })
  registrationNumber: string;

  @ManyToOne(() => Class, { nullable: false })
  @JoinColumn({ name: 'studentClassId' })
  studentClass: Class;

  @ManyToOne(() => School, { nullable: false })
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @Column({ nullable: false })
  cpfGuardian: string;
}
