import {Patient} from '../models/Patient';
import {generateToken} from '../utils/jwtHelper';
import {patientRepository} from '../repositories/patientRepository';
import bcrypt from 'bcryptjs';
import {ILike, Like} from "typeorm";

export const findPatientByCpf = async (cpf: string): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { cpf }, relations: ['tenants'] });
};

export const listPatientByTenant = async (filters: {
    patientCpf?: string
    patientName?: string
},tenantId: number, take?: number, skip?: number): Promise<Patient[]> => {
    const whereCondition: any = {};
    if(tenantId) {
        whereCondition.tenants = { id: tenantId } ;
    }
    if (filters.patientCpf) {
        whereCondition.cpf =  Like(`%${filters.patientCpf}%`)
    }
    if (filters.patientName) {
        whereCondition.full_name = Like(`%${filters.patientName}%`);
    }
    console.log(whereCondition);

    return await patientRepository.find({
        where: whereCondition,
        take: take,
        skip: skip,
    });

};
export const updatePatientService = async (patientData: {
    full_name?: string;
    cpf?: string;
    dob: Date;
    email: string;
    canal?: string;
    phone?: string;
    address: string;
    gender?: string;
    health_card_number?: string;
}) => {

    try {
         await patientRepository.update({ cpf: patientData.cpf}, patientData);
        return { message: 'Dados do Paciente atualizado' };
    } catch (error) {
        console.log(error);
    }
}
export const registerPatient = async (patientData: {
    full_name: string;
    cpf: string;
    password: string;
    dob: Date;
    email: string;
    canal?: string;
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

