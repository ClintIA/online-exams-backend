import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    Index,
    JoinTable
} from 'typeorm';
import { Tenant } from './Tenant';
import {ProfileRole} from "../types/enums/role";

@Entity()
@Index(['id'])
export class Patient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    full_name!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column({type: 'date'})
    dob!: Date;

    @Column({ unique: true })
    email?: string;

    @Column()
    phone?: string;

    @Column()
    cep?: number;

    @Column( { enum: ProfileRole, default: 'patient' } )
    role!: string;

    @Column()
    canal?: string;

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
    @JoinTable()
    tenants!: Tenant[];
}
