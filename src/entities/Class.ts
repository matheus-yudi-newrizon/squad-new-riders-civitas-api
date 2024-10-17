import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({
    type: 'enum',
    enum: ['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year'],
    nullable: false
  })
  anoLetivo: string;

  @Column({
    type: 'enum',
    enum: ['Morning', 'Afternoon', 'Night'],
    nullable: false
  })
  periodoLetivo: string;

  @Column({
    type: 'enum',
    enum: ['Nursery', 'Preschool', 'Elementary school 1'],
    nullable: false
  })
  ensino: string;
}
