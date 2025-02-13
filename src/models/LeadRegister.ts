import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    Index,
    JoinTable, DeleteDateColumn
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

    @Column({ unique: true })
    diagnostic?: string;


    @Column()
    obs?: string;

    @Column()
    canal?: string;

    @Column({ default: false })
    isPatient?: boolean;

    @Column({ nullable: true })
    gender?: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToMany(() => Tenant, tenant => tenant.patients)
    @JoinTable()
    tenants!: Tenant[];

    @DeleteDateColumn()
    delete_at?: Date;
}
