import { patientRepository } from '../repositories/patientRepository';

export const saveFileLinkToPatient = async (patientCpf: string, fileUrl: string) => {
    console.log("Salvando link do arquivo no banco de dados...");
    console.log("CPF do paciente:", patientCpf);
    console.log("URL do arquivo:", fileUrl);

    const patient = await patientRepository.findOne({ where: { cpf: patientCpf } });

    if (!patient) {
        console.error('Paciente não encontrado');
        throw new Error('Paciente não encontrado');
    }

    patient.exams = [...(patient.exams || []), fileUrl];

    await patientRepository.save(patient);

    console.log("Link do arquivo salvo com sucesso.");
};
