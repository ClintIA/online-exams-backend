export interface RegisterAdminDTO {
    email: string;
    cpf: string;
    fullName: string;
    phone?: string;
    role?: string;
    cep?: string;
    password?: string;
}