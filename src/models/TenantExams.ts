import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, ManyToMany } from 'typeorm';
import { Tenant } from './Tenant';
import { Admin } from './Admin';
import {Doctor} from "./Doctor";

@Entity()
@Index(['id', 'exam_name'])
export class TenantExams {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    exam_name!: string;

    @Column()
    exam_type!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column('decimal', { precision: 10, scale: 2,  nullable: true })
    doctorPrice!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.exams)
    tenant!: Tenant;    

    @ManyToMany(() => Doctor, admin => admin.exams)
    doctors!: Doctor[];
}
