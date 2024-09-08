import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Patient } from './Patient';
import { Tenant } from './Tenant';

@Entity()
export class PatientClinic {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Patient, patient => patient.tenants)
    patient!: Patient;

    @ManyToOne(() => Tenant, tenant => tenant.patients)
    tenant!: Tenant;
}
