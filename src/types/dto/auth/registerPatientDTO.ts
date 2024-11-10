export interface RegisterPatientDTO {
    full_name: string;
    cpf: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    canal: string;
    gender?: string;
    health_card_number?: string;
    password?: string;
}
