export interface RegisterAdminDTO {
    email: string;
    cpf: string;
    fullName: string;
    CRM?: string;
    phone?: string;
    isDoctor?: boolean;
    password?: string;
    occupation?: string
}