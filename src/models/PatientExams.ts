import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Patient } from './Patient';
import { Admin } from './Admin';
import { TenantExams } from './TenantExams';
import {Doctor} from "./Doctor";

@Entity()
@Index(['id', 'patient', 'examDate', 'status'])
export class PatientExams {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Patient, patient => patient.exams)
    patient!: Patient;

    @ManyToOne(() => TenantExams, exam => exam.id)
    exam!: TenantExams;

    @Column({ nullable: true })
    link?: string;

    @ManyToOne(() => Admin, admin => admin.id)
    createdBy!: Admin;

    @ManyToOne(() => Admin, admin => admin.id, { nullable: true })
    uploadedBy?: Admin;

    @ManyToOne(() => Admin, admin => admin.id, { nullable: true })
    doctor?: Doctor;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    examDate?: Date;

    @Column({ nullable: true })
    uploadedAt?: Date;

    @Column({ type: 'enum', enum: ['Scheduled', 'InProgress', 'Completed'], default: 'Scheduled' })
    status!: 'Scheduled' | 'InProgress' | 'Completed';

    @Column({ type: 'boolean', default: null })
    attended!: boolean;
}
