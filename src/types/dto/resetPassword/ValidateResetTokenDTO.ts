export interface ValidateResetTokenDTO {
    identifier: string; // Email ou CPF do usuário
    token: string;      // Token de validação
}