import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import { Tenant } from './Tenant';
import { TenantExams } from './TenantExams';

@Entity()
@Index(['id', 'cpf', 'fullName'])
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column()
    password!: string;

    @Column()
    fullName!: string;

    @Column({ nullable: true })
    sessionToken?: string;
    
    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins)
    tenant!: Tenant;

    @Column({ default: false })
    isDoctor!: boolean;

    @ManyToMany(() => TenantExams, exam => exam.doctors)
    @JoinTable()
    exams!: TenantExams[];
}
