import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Patient } from './Patient';
import { Admin } from './Admin';
import { Product } from './Product';
import { TenantExams } from './TenantExams';

@Entity()
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

    @ManyToMany(() => Patient, patient => patient.tenants)
    @JoinTable()
    patients!: Patient[];

    @OneToMany(() => Admin, admin => admin.tenant)
    admins!: Admin[];

    @OneToMany(() => TenantExams, tenantExams => tenantExams.tenant)
    exams!: TenantExams[];
}
