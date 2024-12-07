export interface RegisterPatientDTO {
    full_name: string;
    cpf: string;
    dob: string;
    email: string;
    phone: string;
    cep: number;
    canal: string;
    gender: "Masculino" | "Feminino" | "Prefiro não informar" | "Outros";
    health_card_number?: string;
    password?: string;
}
