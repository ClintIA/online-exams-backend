import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';
import {Admin} from "./Admin";

@Entity()
@Index(['id', 'exam_name'])
export class TenantExams {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    exam_name!: string;

    @ManyToOne(() => Admin, admin => admin.id)
    createdBy!: Admin;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.exams)
    tenant!: Tenant;    
}
