import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
    ManyToMany,
    JoinTable,
    DeleteDateColumn
} from 'typeorm';
import { Tenant } from './Tenant';
import { TenantExams } from './TenantExams';
import {ProfileRole} from "../types/enums/ProfileRole";

@Entity()
@Index(['id', 'CRM', 'fullName', 'occupation'])
export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    cpf!: string;

    @Column()
    password!: string;

    @Column({ unique: true, nullable: true })
    email!: string;

    @Column({ unique: true })
    CRM!: string;

    @Column()
    cep!: string;

    @Column( { enum: ProfileRole, default: 'doctor' } )
    role!: string;

    @Column({ unique: true })
    cnpj!: string;

    @Column()
    phone!: string;

    @Column()
    fullName!: string;

    @Column({ nullable: true})
    occupation?: string;

    @Column({ nullable: true })
    sessionToken?: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins)
    tenant!: Tenant;

    @ManyToMany(() => TenantExams, exam => exam.doctors)
    @JoinTable()
    exams!: TenantExams[];
    @DeleteDateColumn()
    delete_at?: Date;
}
