import AppDataSource from '../config/database';
import { User } from '../models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';

const userRepository = AppDataSource.getRepository(User);

const findUserByEmailAndTenant = async (email: string, tenantId: number): Promise<User | null> => {
    return await userRepository.findOne({ where: { email, tenant: { id: tenantId } } });
};

const findUserByProtocolAndTenant = async (protocol: string, tenantId: number): Promise<User | null> => {
    return await userRepository.findOne({ where: { protocol, tenant: { id: tenantId } } });
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const registerUser = async (email: string, tenantId: number) => {
    const existingUser = await findUserByEmailAndTenant(email, tenantId);

    if (existingUser) {
        throw new Error('Usuário já cadastrado');
    }

    const protocol = `U-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);

    const newUser = userRepository.create({
        email,
        password: hashedPassword,
        protocol,
        tenant: { id: tenantId }
    });

    await userRepository.save(newUser);

    return { protocol, tempPassword };
};

export const registerAdmin = async (email: string, tenantId: number) => {
    const existingAdmin = await findUserByEmailAndTenant(email, tenantId);

    if (existingAdmin) {
        throw new Error('Admin já cadastrado');
    }

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);

    const newAdmin = userRepository.create({
        email,
        password: hashedPassword,
        is_admin: true,
        tenant: { id: tenantId }
    });

    await userRepository.save(newAdmin);

    return { tempPassword };
};

export const loginAdmin = async (email: string, password: string, tenantId: number) => {
    const user = await findUserByEmailAndTenant(email, tenantId);

    if (!user || !user.is_admin) {
        throw new Error('Admin não encontrado');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(user.id, tenantId, user.is_admin);
    return token;
};

export const loginPatient = async (protocol: string, password: string, tenantId: number) => {
    const user = await findUserByProtocolAndTenant(protocol, tenantId);

    if (!user) {
        throw new Error('Paciente não encontrado');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const token = generateToken(user.id, tenantId, false);
    return token;
};
