import {ProfileRole} from "../../enums/role";

export interface RegisterAdminDTO {
    email: string;
    cpf: string;
    fullName: string;
    phone?: string;
    role?: ProfileRole;
    cep?: string;
    password?: string;
}