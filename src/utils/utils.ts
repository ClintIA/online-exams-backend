export const generatePassword = (patientData) => {
    const nome = patientData.full_name.toLowerCase().replace(/\s/g, '')
    const dataNascimento = patientData.dob.replace(/\D/g, '')
    const cpf = patientData.cpf.replace(/\D/g, '')

    // Gera uma senha combinando partes dos dados do paciente
    return nome +
        dataNascimento.substring(0, 4)
}