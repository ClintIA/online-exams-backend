import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Patient } from './Patient';
import { Admin } from './Admin';
import { TenantExams } from './TenantExams';

@Entity()
@Index(['id'])
export class PatientExams {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Patient, patient => patient.exams)
    patient!: Patient;

    @ManyToOne(() => TenantExams, exam => exam.id)
    exam!: TenantExams;

    @Column()
    link!: string;

    @ManyToOne(() => Admin, admin => admin.id)
    createdBy!: Admin;

    @ManyToOne(() => Admin, admin => admin.id)
    uploadedBy!: Admin;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    uploadedAt?: Date;
}
