import { Patient } from '../models/Patient';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { sendLoginTokenSMS } from './smsService';
import { patientRepository } from '../repositories/patientRepository';

const findPatientByCpfAndTenant = async (cpf: string, tenantId: number): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf, tenant: { id: tenantId } } });
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const registerPatient = async (patientData: {
    full_name: string,
    cpf: string,
    dob: Date,
    email: string,
    phone: string,
    address: string,
    gender?: string,
    health_card_number?: string
}, tenantId: number) => {
    const existingPatient = await findPatientByCpfAndTenant(patientData.cpf, tenantId);

    if (existingPatient) {
        throw new Error('Paciente já cadastrado');
    }

    const newPatient = patientRepository.create({
        ...patientData,
        tenant: { id: tenantId }
    });

    await patientRepository.save(newPatient);

    return { message: 'Paciente registrado com sucesso' };
};

export const loginStepOne = async (cpf: string, tenantId: number) => {
    const patient = await findPatientByCpfAndTenant(cpf, tenantId);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }

    const loginToken = crypto.randomInt(100000, 999999).toString();
    patient.temp_password = await hashPassword(loginToken);

    await patientRepository.save(patient);

    sendLoginTokenSMS(patient.tenant.id ,patient.phone!, loginToken);

    return { message: 'Token de login enviado para o celular' };
};

export const loginStepTwo = async (cpf: string, loginToken: string, tenantId: number) => {
    const patient = await findPatientByCpfAndTenant(cpf, tenantId);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }

    const isTokenValid = await comparePassword(loginToken, patient.temp_password!);
    if (!isTokenValid) {
        throw new Error('Token inválido');
    }

    if (patient.sessionToken) {
        patient.sessionToken = undefined;
    }

    const token = generateToken(patient.id, tenantId, false);
    patient.sessionToken = token;
    patient.temp_password = undefined;

    await patientRepository.save(patient);

    return token;
};
