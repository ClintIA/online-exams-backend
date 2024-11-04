import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { adminRepository } from '../repositories/adminRepository';
import {ILike, Like} from "typeorm";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email }, relations: ['tenant'] });
};
export const findAdminById = async (id: number,tenantId: number): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { id, tenant: { id: tenantId } } });
};
export const findDoctorById = async (id: number, tenantId: number): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { tenant: { id: tenantId }, id: id } });
};
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
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
export const getDoctors = async (tenantId: number, take: number = 1, skip: number = 0) => {
    const [doctors, total] = await adminRepository.findAndCount({
        select: {
            id: true,
            fullName: true,
            email: true,
            CRM: true,
            phone: true,

        },
        take: take,
        skip: skip,
        where: {
            isDoctor: true,
            tenant: {
                id: tenantId
            }
        }
    })
    return { doctors, total }
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
        select: {
            id:true,
            fullName: true
        }
    });
};