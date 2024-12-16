import {ProfileRole} from "../../enums/role";

export interface UpdateAdminDTO {
    email: string;
    cpf: string;
    fullName: string;
    phone?: string;
    role?: ProfileRole;
    cep?: string;
}
