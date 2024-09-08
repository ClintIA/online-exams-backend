import { Patient } from '../models/Patient';
import { Tenant } from '../models/Tenant';
import { generateToken } from '../utils/jwtHelper';
import { patientRepository } from '../repositories/patientRepository';
import { tenantRepository } from '../repositories/tenantRepository';

const findPatientByCpf = async (cpf: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf }, relations: ['tenants'] });
};

const findTenantById = async (tenantId: number): Promise<Tenant | null> => {
    return await tenantRepository.findOne({ where: { id: tenantId } });
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
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    let patient = await findPatientByCpf(patientData.cpf);

    if (patient) {
        if (patient.tenants.some(t => t.id === tenantId)) {
            throw new Error('Paciente já está associado a essa clínica');
        }

        Object.assign(patient, patientData);

        patient.tenants.push(tenant);
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

