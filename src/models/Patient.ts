import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, Index } from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
@Index(['id', 'cpf'])
export class Patient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    full_name!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column('date')
    dob!: Date;

    @Column({ unique: true })
    email?: string;

    @Column()
    phone?: string;

    @Column()
    address?: string;

    @Column({ nullable: true })
    gender?: string;

    @Column({ nullable: true })
    health_card_number?: string;

    @Column("simple-array", { nullable: true })
    exams?: string[];
    
    @Column({ nullable: true })
    sessionToken?: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToMany(() => Tenant, tenant => tenant.patients)
    tenants!: Tenant[];
}
