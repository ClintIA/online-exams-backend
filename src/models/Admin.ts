import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Tenant } from './Tenant';
import {ProfileRole} from "../types/enums/role";

@Entity()
@Index(['id', 'cpf', 'fullName'])
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column()
    password!: string;

    @Column({nullable: true})
    phone!: string;

    @Column({ nullable: true } )
    role!: ProfileRole;

    @Column({nullable: true})
    cep!: string;

    @Column()
    fullName!: string;

    @Column({ nullable: true })
    sessionToken?: string;
    
    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins)
    tenant!: Tenant;

}
