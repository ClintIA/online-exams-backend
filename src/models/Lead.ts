import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
    JoinTable,
    DeleteDateColumn
} from 'typeorm';
import { Tenant } from './Tenant';
import { TenantExams } from './TenantExams';
import { Doctor } from './Doctor';

@Entity()
@Index(['id'])
export class Lead {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    phoneNumber!: string;

    @ManyToOne(() => TenantExams, { nullable: true })
    @JoinTable()
    exam?: TenantExams;

    @CreateDateColumn()
    callDate!: Date;

    @Column()
    canal!: string;

    @Column({ nullable: true })
    indication_name?: string;

    @Column({ nullable: true })
    contactChannel?: string;

    @Column({ nullable: true })
    diagnosis?: string;

    @Column({ default: false })
    scheduled!: boolean;

    @ManyToOne(() => Doctor, { nullable: true })
    scheduledDoctor?: Doctor;

    @Column({ nullable: true })
    scheduledDate?: Date;

    @ManyToOne(() => Tenant, tenant => tenant.patients, { nullable: false })
    tenant!: Tenant;

    @DeleteDateColumn()
    delete_at?: Date;
}
