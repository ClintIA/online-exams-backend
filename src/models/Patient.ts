import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
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

    @Column({ nullable: true })
    temp_password?: string;
    
    @Column({ nullable: true })
    sessionToken?: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.patients)
    tenant!: Tenant;
}
