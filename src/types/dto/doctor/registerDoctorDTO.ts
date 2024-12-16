import {ProfileRole} from "../../enums/role";

export interface RegisterDoctorDTO {
    cpf: string;
    fullName: string;
    CRM?: string;
    phone?: string;
    role?: ProfileRole;
    cep?: string;
    CNPJ?:string;
    occupation?:string;
    password?: string;
}