import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import {Admin} from "./Admin";
import {Tenant} from "./Tenant";

@Entity()
@Index(['id', 'date', 'message', 'createdBy'])
export class NoticeCard {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: string;

    @ManyToOne(() => Admin, admin => admin.id, { nullable: true })
    createdBy?: Admin;

    @Column({ type: 'date'})
    date!: Date;

    @ManyToOne(() => Tenant, tenant => tenant.admins)
    tenant!: Tenant;

    @CreateDateColumn()
    created_at!: Date;
}
