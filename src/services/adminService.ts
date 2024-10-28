import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { adminRepository } from '../repositories/adminRepository';
import {ILike, Like} from "typeorm";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email }, relations: ['tenant'] });
};

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const registerAdmin = async (adminData: { email: string, adminCpf: string, password: string, fullName: string }, tenantId: number) => {
    const existingAdmin = await findAdminByEmail(adminData.email);

    if (existingAdmin) {
        throw new Error('Admin já cadastrado');
    }

    const hashedPassword = await hashPassword(adminData.password);

    const newAdmin = adminRepository.create({
        email: adminData.email,
        password: hashedPassword,
        cpf: adminData.adminCpf,
        fullName: adminData.fullName,
        tenant: { id: tenantId }
    });

    await adminRepository.save(newAdmin);

    return { message: 'Admin registrado com sucesso' };
};

export const loginAdmin = async (email: string, password: string) => {
    const admin = await findAdminByEmail(email);

    if (!admin) {
        throw new Error('Admin não encontrado');
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida');
    }

    const tenantId = admin.tenant.id;

    if (admin.sessionToken) {
        admin.sessionToken = undefined;
    }

    const token = generateToken(admin.id, true, tenantId);

    admin.sessionToken = token;
    await adminRepository.save(admin);

    return token;
};

export const getAdmins = async (tenantId: number) => {
    return await adminRepository.find({
        select: {
            email: true,
            cpf: true,
            fullName: true,

        },
        where: {
            tenant: {
                id: tenantId
            }
        }
    })
}

export const getAdminsByCPF = async (cpf: string, tenantId: number) => {
    return await adminRepository.find({
        select: {
            email: true,
            fullName: true,
            cpf: true,
        },
        where: {
            cpf: ILike("%"+cpf+"%"),
            tenant: { id: tenantId },
        },
        relations: ['tenant']
    })
}
export const getAdminsByName = async (name: string, tenantId: number) => {
    return await adminRepository.find({
        select: {
            email: true,
            fullName: true,
            cpf: true
        },
        where: {
            fullName: ILike("%"+name+"%"),
            tenant: { id: tenantId },
        },
        relations: ['tenant']
    })
}

export const getDoctorsByExamName = async (examName: string) => {
    return await adminRepository.find({
        where: {
            exams: { exam_name: ILike(`%${examName}%`) },
            isDoctor: true,
        },
        relations: ['exams'],
        select: {fullName: true}
    });
};