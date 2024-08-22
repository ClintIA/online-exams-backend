import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from './Patient';
import { Admin } from './Admin';
import { Product } from './Product';

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

    @Column({ default: 0 })
    smsUsage!: number;

    @OneToMany(() => Patient, patient => patient.tenant)
    patients!: Patient[];

    @OneToMany(() => Admin, admin => admin.tenant)
    admins!: Admin[];
}
