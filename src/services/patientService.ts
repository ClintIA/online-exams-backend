import {Patient} from '../models/Patient';
import {generateToken} from '../utils/jwtHelper';
import {patientRepository} from '../repositories/patientRepository';
import bcrypt from 'bcryptjs';

export const findPatientByCpf = async (cpf: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf } });
};

export const findPatientByEmail = async (email: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { email } });
};

export const listPatientByTenant = async (tenantId: number): Promise<Patient[]> => {
    return await patientRepository.find({
        where: { tenants: { id: tenantId } },
    });
};

export const registerPatient = async (patientData: {
    full_name: string;
    cpf: string;
    password: string;
    dob: Date;
    email: string;
    phone: string;
    address: string;
    gender?: string;
    health_card_number?: string;
}, tenantId: number) => {

    const passwordToFront = patientData.password;

    let patient = await findPatientByCpf(patientData.cpf);

    if (patient) {
        if (patient.tenants.some(t => t.id === tenantId)) {
            throw new Error('Paciente já está associado a essa clínica');
        }

        Object.assign(patient, patientData);
        patient.tenants.push({ id: tenantId } as any);

    } else {
        const hashedPassword = await bcrypt.hash(patientData.password, 10);
        patient = patientRepository.create({
            ...patientData,
            password: hashedPassword,
            tenants: [{ id: tenantId } as any],
        });
    }

    await patientRepository.save(patient);
    return { message: 'Paciente registrado com sucesso', password: passwordToFront };
};


export const loginPatientByCpf = async (cpf: string, password: string) => {
    const patient = await findPatientByCpf(cpf);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }
    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(patient.id, false);
    patient.sessionToken = token;
    
    await patientRepository.save(patient);

    return token;
};

