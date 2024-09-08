import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    uploadLimit!: number;

    @OneToMany(() => Tenant, tenant => tenant.product)
    tenants!: Tenant[];
}
