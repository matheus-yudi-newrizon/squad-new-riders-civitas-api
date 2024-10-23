import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './Class';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  fullName: string;

  @Column({ nullable: false })
  document: string;

  @Column({ nullable: false, length: 20 })
  registrationNumber: string;

  @ManyToOne(() => Class, { nullable: false })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ nullable: false })
  cpfGuardian: string;
}
