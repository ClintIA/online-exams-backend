import {Patient} from '../models/Patient';
import {generateToken} from '../utils/jwtHelper';
import {patientRepository} from '../repositories/patientRepository';
import bcrypt from 'bcryptjs';
import {Like} from "typeorm";
import {PatientFiltersDTO} from '../types/dto/patient/patientFiltersDTO';
import {UpdatePatientDTO} from '../types/dto/patient/updatePatientDTO';
import {RegisterPatientDTO} from '../types/dto/auth/registerPatientDTO';
import {LoginPatientDTO} from '../types/dto/auth/loginPatientDTO';
import {LoginAdminDTO} from "../types/dto/auth/loginAdminDTO";
import {findPatientByPhone} from "../controllers/patientController";

export const findPatientByCpf = async (cpf: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf }, relations: ['tenants'] });
};
export const findPatientByPhoneService = async (phone: string | undefined): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { phone: phone }, relations: ['tenants'] });
};

export const listPatientByTenant = async (
    filters: PatientFiltersDTO,
    tenantId: number, 
    take?: number, 
    skip?: number
): Promise<Patient[]> => {
    const whereCondition: any = { tenants: { id: tenantId } };

    if (filters.patientCpf) {
        whereCondition.cpf = Like(`%${filters.patientCpf}%`);
    }
    if (filters.patientName) {
        whereCondition.full_name = Like(`%${filters.patientName}%`);
    }

    return await patientRepository.find({
        where: whereCondition,
        take,
        skip,
    });
};

export const deletePatientService = async (patientId: number) => {
    await patientRepository.softDelete({ id: patientId });
    return { message: "Paciente deletado com sucesso" };
}

export const updatePatientService = async (patientData: UpdatePatientDTO, patientId: number) => {
    try {
       const result = await patientRepository.save(patientData);
        return { message: 'Dados do paciente atualizados' };
    } catch (error) {
        throw new Error('Erro ao atualizar os dados do paciente');
    }
};

export const registerPatient = async (patientData: RegisterPatientDTO, tenantId: number) => {
    let patient = await findPatientByCpf(patientData.cpf);

    if (patient) {
        if (patient.tenants.some(t => t.id === tenantId)) {
            throw new Error('Paciente já está associado a essa clínica');
        }

        Object.assign(patient, patientData);
        patient.tenants.push({ id: tenantId } as any);
    } else {
        const hashedPassword = await bcrypt.hash(patientData.password!, 10);
        patient = patientRepository.create({
            ...patientData,
            password: hashedPassword,
            tenants: [{ id: tenantId } as any],
            role: 'patient'
        });
    }
    const result = await patientRepository.save(patient);
    const resultWithoutPassword = { ...result, password: undefined }

    return { data: resultWithoutPassword, message : 'Paciente registrado com sucesso' };
};

export const loginPatientByCpf = async (loginData: LoginAdminDTO) => {
    const patient = await findPatientByCpf(loginData.user);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, patient.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(patient.id, patient.role);
    patient.sessionToken = token;

    await patientRepository.save(patient);
    return token;
};
