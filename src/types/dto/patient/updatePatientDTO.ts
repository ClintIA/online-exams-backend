export interface UpdatePatientDTO {
    full_name?: string;
    cpf?: string;
    dob?: string;
    email?: string;
    canal?: string;
    phone?: string;
    cep?: string;
    role?: string;
    gender: "Masculino" | "Feminino" | "Prefiro não informar";
    health_card_number?: string;
    password?: string;

}