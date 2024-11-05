import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Patient} from "./Patient";

@Entity('canais')
@Index(['id'])
export class Canal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    canalName!: string;

    @OneToMany(() => Patient, patient => patient.id)
    patients!: Patient[];

}