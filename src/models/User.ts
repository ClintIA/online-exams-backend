import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from './Tenant';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    protocol!: string;

    @CreateDateColumn()
    created_at!: Date;

    @Column({ nullable: true })
    sessionToken?: string;

    @ManyToOne(() => Tenant, tenant => tenant.users)
    tenant!: Tenant;

    @Column({ default: false })
    is_admin!: boolean;
}
