import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Admin} from "./Admin";
import {Tenant} from "./Tenant";


@Entity()
@Index(['id', 'canal', 'tenant'])
export class Marketing {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    canal!: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    budgetCanal!: number;

    @ManyToOne(() => Admin, admin => admin.id)
    createdBy?: Admin;

    @ManyToOne(() => Admin, admin => admin.id)
    updatedBy?: Admin;

    @ManyToOne(() => Tenant, tenant => tenant.exams)
    tenant!: Tenant;

    @UpdateDateColumn()
    updated_at!: Date;

    @CreateDateColumn()
    created_at!: Date;
}