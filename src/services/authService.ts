import { AppDataSource } from '../config/database';
import { Patient } from '../models/Patient';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { Admin } from '../models/Admin';

const patientRepository = AppDataSource.getRepository(Patient);
const adminRepository = AppDataSource.getRepository(Admin);

const findPatientByEmailAndTenant = async (email: string, tenantId: number): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { email, tenant: { id: tenantId } } });
};

const findAdminByEmailAndTenant = async (email: string, tenantId: number): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email, tenant: { id: tenantId } } });
};

const findPatientByProtocolAndTenant = async (protocol: string, tenantId: number): Promise<Patient | null> => {
    return await patientRepository.findOne({ where: { protocol, tenant: { id: tenantId } } });
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
    const existingPatient = await findPatientByEmailAndTenant(patientData.email, tenantId);

    if (existingPatient) {
        throw new Error('Paciente já cadastrado');
    }

    const protocol = `P-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);

    const newPatient = patientRepository.create({
        ...patientData,
        protocol,
        temp_password: hashedPassword,
        tenant: { id: tenantId }
    });

    await patientRepository.save(newPatient);

    return { protocol, tempPassword };
};

export const registerAdmin = async (adminData: { email: string, password: string, fullName: string }, tenantId: number) => {
    const existingAdmin = await findAdminByEmailAndTenant(adminData.email, tenantId);

    if (existingAdmin) {
        throw new Error('Admin já cadastrado');
    }

    const hashedPassword = await hashPassword(adminData.password);

    const newAdmin = adminRepository.create({
        email: adminData.email,
        password: hashedPassword,
        fullName: adminData.fullName,
        tenant: { id: tenantId }
    });

    await adminRepository.save(newAdmin);

    return { message: 'Admin registrado com sucesso' };
};

export const loginAdmin = async (email: string, password: string, tenantId: number) => {
    const admin = await findAdminByEmailAndTenant(email, tenantId);

    if (!admin) {
        throw new Error('Admin não encontrado');
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(admin.id, tenantId, true);

    admin.sessionToken = token;
    await adminRepository.save(admin);

    return token;
};

export const loginPatient = async (protocol: string, password: string, tenantId: number) => {
    const patient = await findPatientByProtocolAndTenant(protocol, tenantId);

    if (!patient) {
        throw new Error('Paciente não encontrado');
    }

    const isPasswordValid = await comparePassword(password, patient.temp_password!);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(patient.id, tenantId, false);

    patient.sessionToken = token;
    await patientRepository.save(patient);

    return token;
};
