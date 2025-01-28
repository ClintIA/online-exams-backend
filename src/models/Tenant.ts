import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { Patient } from './Patient';
import { Admin } from './Admin';
import { Product } from './Product';
import { TenantExams } from './TenantExams';

@Entity()
@Index(['id'])
export class Tenant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    domain!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Product, product => product.tenants)
    product!: Product;

    @Column({default: 0})
    uploadUsage!: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    budgetTotal!: number;

    @Column({ unique: true })
    whatsAppNumber!: string;

    @ManyToMany(() => Patient, patient => patient.tenants)
    patients!: Patient[];

    @OneToMany(() => Admin, admin => admin.tenants)
    admins!: Admin[];

    @OneToMany(() => TenantExams, tenantExams => tenantExams.tenant)
    exams!: TenantExams[];
}
