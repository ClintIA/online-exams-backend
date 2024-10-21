import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';
import {Admin} from "./Admin";
import {TenantExams} from "./TenantExams";

@Entity()
@Index(['id', 'doctor','tenant'])
export class DoctorAvailability {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Admin, admin => admin.id)
    doctor!: Admin;

    @Column("simple-array", { nullable: false })
    availabilityDays!:  number[];

    @ManyToOne(() => TenantExams, exam => exam.id)
    exam!: TenantExams[];

    @Column({ type: 'time' })
    startTime!: string;

    @Column({ type: 'time' })
    endTime!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins, { nullable: false })
    tenant!: Tenant;
}
