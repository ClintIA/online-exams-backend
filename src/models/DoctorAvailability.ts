import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';
import {Admin} from "./Admin";

@Entity()
@Index(['id', 'doctor', 'date','tenant'])
export class DoctorAvailability {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Admin, admin => admin.id)
    doctor!: Admin;

    @Column()
    date!:  Date;

    @Column()
    startTime!: string;

    @Column()
    endTime!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins, { nullable: false })
    tenant!: Tenant;
}
