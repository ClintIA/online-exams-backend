export const generatePassword = (patientData: { full_name: string, dob: string}) => {
    const nome = patientData.full_name.toLowerCase().replace(/\s/g, '')
    const dataNascimento = patientData.dob.replace(/\D/g, '')

    return nome.toLowerCase() +
        dataNascimento.substring(0, 4)
}