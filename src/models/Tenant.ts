import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Patient } from './Patient';
import { User } from './User';
import { Admin } from './Admin';

@Entity()
export class Tenant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    domain!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => Patient, patient => patient.tenant)
    patients!: Patient[];

    @OneToMany(() => User, user => user.tenant)
    users!: User[];

    @OneToMany(() => Admin, admin => admin.tenant)
    admins!: Admin[];
}
