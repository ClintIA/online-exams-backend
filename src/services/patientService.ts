import {Patient} from '../models/Patient';
import {generateToken} from '../utils/jwtHelper';
import {patientRepository} from '../repositories/patientRepository';
import {findTenantById} from './tenantService';
import {tenantRepository} from "../repositories/tenantRepository";
import {ILike} from "typeorm";

export const findPatientByCpf = async (cpf: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf }, relations: ['tenants'] });
};
export const findPatientByEmail = async (email: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { email }, relations: ['tenants'] });
};

export const findPatientByCpfAndTenant = async (cpf: string, tenantId: number): Promise<Patient | null> => {
    return await patientRepository.findOne(
        { where: {
                cpf: cpf,
                tenants: {
                    id: tenantId
                }
            },
            relations: ['tenants'] });
};

export const listPatientByTenant = async (tenantId: number): Promise<Patient[]> => {
    const tenant = await tenantRepository.findOne({ where: { id: tenantId  } });
    if(!tenant)  {
        throw new Error('Tenant Não encontrado');
    }
    return await patientRepository.find( { where: { tenants: {
        id: tenantId,
            } }});
}

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
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    const patientEmail = await findPatientByEmail(patientData.email);
    if (patientEmail) {
        throw new Error('Já possui um paciente associado a esse e-mail');

    }

    let patient = await findPatientByCpf(patientData.cpf);

    if (patient) {
        if (patient.tenants.some(t => t.id === tenantId)) {
            throw new Error('Paciente já está associado a essa clínica');
        }

        Object.assign(patient, patientData);

        patient.tenants.push(tenant);

        await patientRepository.save(patient);

        return { message: 'Clínica registrada ao paciente com sucesso' };

    } else {
        patient = patientRepository.create({
            ...patientData,
            tenants: [tenant]
        });
    }

    await patientRepository.save(patient);

    return { message: 'Paciente registrado com sucesso' };
};


export const loginPatientByCpf = async (cpf: string) => {
    const patient = await findPatientByCpf(cpf);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }

    if (patient.sessionToken) {
        patient.sessionToken = undefined;
    }

    const token = generateToken(patient.id, false);

    patient.sessionToken = token;
    await patientRepository.save(patient);

    return token;
};

