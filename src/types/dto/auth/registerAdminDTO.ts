export interface RegisterAdminDTO {
    email: string;
    adminCpf: string;
    fullName: string;
    CRM?: string;
    phone?: string;
    isDoctor?: boolean;
    password?: string;
}