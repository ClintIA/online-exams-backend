import {Patient} from '../models/Patient';
import {generateToken} from '../utils/jwtHelper';
import {patientRepository} from '../repositories/patientRepository';
import bcrypt from 'bcryptjs';
import {Like} from "typeorm";
import {PatientFiltersDTO} from '../types/dto/patient/patientFiltersDTO';
import {UpdatePatientDTO} from '../types/dto/patient/updatePatientDTO';
import {RegisterPatientDTO} from '../types/dto/auth/registerPatientDTO';
import {LoginPatientDTO} from '../types/dto/auth/loginPatientDTO';
import {patientExamsRepository} from "../repositories/patientExamsRepository";

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

export const deletePatientService = async (patientId: number, tenantId: number) => {
    const patient = await patientRepository.findOne({
        where: { id: patientId },
        relations: ['tenants'],
    });

    if (!patient) {
        throw new Error('Paciente não encontrado.');
    }

    const tenantAssociation = patient.tenants.find((t) => t.id === tenantId);
    if (!tenantAssociation) {
        throw new Error('Paciente não está associado ao tenant especificado.');
    }

    const hasDependencies = await patientExamsRepository.count({
        where: { patient: { id: patient.id } },
    });

    if (hasDependencies > 0) {
        patient.tenants = patient.tenants.filter((t) => t.id !== tenantId);
        await patientRepository.save(patient);
        return {
            message: 'Paciente desassociado do tenant, mas não deletado devido a dependências.'
        };
    }

    if (patient.tenants.length > 1) {
        patient.tenants = patient.tenants.filter((t) => t.id !== tenantId);
        await patientRepository.save(patient);
        return { message: 'Paciente desassociado do tenant com sucesso.' };
    }

    if (patient.tenants.length === 1) {
        await patientRepository.softDelete(patient.id);
        return {
            message: 'Paciente deletado com sucesso, pois não havia dependências e estava associado a apenas um tenant.',
        };
    }

    throw new Error('Erro inesperado ao deletar/desassociar paciente.');
};

export const updatePatientService = async (patientData: UpdatePatientDTO, patientId: number) => {
    try {
       const result = await patientRepository.save(patientData);
        return { message: 'Dados do paciente atualizados' };
    } catch (error) {
        throw new Error('Erro ao atualizar os dados do paciente');
    }
};

interface RegisterResponse {
    data: Omit<Patient, 'password'>;
    message: string;
}

export const registerPatient = async (patientData: RegisterPatientDTO, tenantId: number): Promise<RegisterResponse> => {
    try {
        if (!patientData.password) {
            throw new Error('Password is required');
        }

        return await handleExistingPatient(patientData, tenantId);
    } catch (error) {
        throw new Error(`Failed to register patient: ${error}`);
    }
};

const handleExistingPatient = async (patientData: RegisterPatientDTO, tenantId: number): Promise<RegisterResponse> => {
    let existingPatient: Patient | null = null;
    
    if (patientData.cpf) {
        existingPatient = await findPatientByCpf(patientData.cpf!);
    } else if (patientData.phone) {
        existingPatient = await findPatientByPhoneService(patientData.phone);
    }

    if (existingPatient) {
        return await updateExistingPatient(existingPatient, patientData, tenantId);
    }

    return await createNewPatient(patientData, tenantId);
};

const createNewPatient = async (patientData: RegisterPatientDTO, tenantId: number): Promise<RegisterResponse> => {
    const hashedPassword = await hashPassword(patientData.password!);

    const newPatient = patientRepository.create({
        ...patientData,
        password: hashedPassword,
        tenants: [{ id: tenantId } as any],
        role: 'patient'
    });

    const result = await patientRepository.save(newPatient);
    return formatPatientResponse(result, 'Paciente registrado com sucesso');
};

const updateExistingPatient = async (
    existingPatient: Patient,
    patientData: RegisterPatientDTO,
    tenantId: number
): Promise<RegisterResponse> => {
    Object.assign(existingPatient, patientData);
    existingPatient.tenants.push({ id: tenantId } as any);

    const result = await patientRepository.save(existingPatient);
    return formatPatientResponse(result, 'Patient successfully added to clinic');
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const formatPatientResponse = (patient: Patient, message: string): RegisterResponse => {
    const { password, ...patientWithoutPassword } = patient;
    return {
        data: patientWithoutPassword,
        message
    };
};

export const loginPatientByCpf = async (loginData: LoginPatientDTO) => {
    const patient = await findPatientByCpf(loginData.cpf);

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
