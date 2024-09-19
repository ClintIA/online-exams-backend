import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
@Index(['id', 'exam_name'])
export class TenantExams {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    exam_name!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.exams)
    tenant!: Tenant;    
}
