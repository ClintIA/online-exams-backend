import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';
import {Admin} from "./Admin";

@Entity()
@Index(['id', 'doctor', 'availabilityDate','tenant'])
export class DoctorAvailability {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Admin, admin => admin.id)
    doctor!: Admin;

    @Column({type: 'date'})
    availabilityDate!:  Date;

    @Column({ type: 'time' })
    startTime!: string;

    @Column({ type: 'time' })
    endTime!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins, { nullable: false })
    tenant!: Tenant;
}
