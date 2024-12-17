export interface ResetPasswordDTO {
    identifier: string; // Email ou CPF do usuário
    token: string;      // Token de validação
    newPassword: string; // Nova senha do usuário
}