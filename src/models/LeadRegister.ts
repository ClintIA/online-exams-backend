import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
     DeleteDateColumn, OneToMany
} from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
@Index(['id', 'full_name', 'phone'])
export class LeadRegister {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    full_name!: string;

    @Column()
    phone!: string;

    @Column()
    obs?: string;

    @Column()
    canal?: string;

    @Column({ nullable: true })
    gender?: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => Tenant, tenant => tenant.id)
    tenants?: Tenant;

    @DeleteDateColumn()
    delete_at?: Date;
}
