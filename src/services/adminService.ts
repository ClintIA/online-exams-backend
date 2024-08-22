import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { adminRepository } from '../repositories/adminRepository';

const findAdminByEmailAndTenant = async (email: string, tenantId: number): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email, tenant: { id: tenantId } } });
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
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

    if (admin.sessionToken) {
        admin.sessionToken = undefined;
    }

    const token = generateToken(admin.id, tenantId, true);

    admin.sessionToken = token;
    await adminRepository.save(admin);

    return token;
};
