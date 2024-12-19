import {ProfileRole} from "../../enums/ProfileRole";

export interface UpdateAdminDTO {
    email: string;
    cpf: string;
    fullName: string;
    phone?: string;
    role?: string;
    cep?: string;
}
