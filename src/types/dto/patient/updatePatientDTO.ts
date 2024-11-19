export interface UpdatePatientDTO {
    full_name?: string;
    cpf?: string;
    dob?: Date;
    email?: string;
    canal?: string;
    phone?: string;
    cep?: number;
    gender: "Masculino" | "Feminino" | "Prefiro não informar";
    health_card_number?: string;
    password?: string;
}