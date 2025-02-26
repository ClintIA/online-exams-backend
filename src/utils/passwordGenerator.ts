export const generatePassword = (patientData: { full_name: string, dob?: string }) => {
    const nome = patientData.full_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '');
    const dataNascimento = patientData.dob?.replace(/\D/g, '') || new Date().getFullYear().toString();

    return nome + dataNascimento.substring(0, 4);
}

export const generatePasswordByCpfAndName = (cpf: string, name: string) => {
    const nome = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '');
    const cpfNumber = cpf.replace(/\D/g, '');

    return nome + cpfNumber.substring(0, 4);
}