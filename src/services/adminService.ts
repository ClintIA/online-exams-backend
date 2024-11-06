import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { adminRepository } from '../repositories/adminRepository';
import {ILike} from "typeorm";
import {authMiddleware} from "../middlewares/authMiddleware";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email: email }, relations: ['tenant'] });
};

export const registerAdmin = async (adminData: { email: string, adminCpf: string, password: string, fullName: string }, tenantId: number) => {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const newAdmin = adminRepository.create({
        email: adminData.email,
        password: hashedPassword,
        cpf: adminData.adminCpf,
        fullName: adminData.fullName,
        tenant: { id: tenantId }
    });

    try {
        await adminRepository.save(newAdmin);
        return { message: 'Admin registrado com sucesso' };
    } catch (error) {
        throw new Error("Erro ao registrar admin: Verifique se o email ou CPF já existe.");
    }
};

export const loginAdmin = async (email: string, password: string) => {
    const admin = await findAdminByEmail(email);
    if (!admin) throw new Error('Admin não encontrado');

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) throw new Error('Senha inválida');
    console.log(admin)
    const token = generateToken(admin.id, true, admin.tenant.id);
    admin.sessionToken = token;
    await adminRepository.save(admin);
    return token;
};


export const getAdmins = async (tenantId: number) => {
    return await adminRepository.find({
        select: { email: true, cpf: true, fullName: true },
        where: { tenant: { id: tenantId } }
    });
};


export const getDoctors = async (tenantId: number, take: number = 10, skip: number = 0) => {
    const [doctors, total] = await adminRepository.findAndCount({
        select: { id: true, fullName: true, email: true, CRM: true, phone: true },
        take,
        skip,
        where: { isDoctor: true, tenant: { id: tenantId } }
    });
    return { doctors, total };
};

export const getAdminByCPF = async (cpf: string) => {
    return await adminRepository.findOne({
        select: { email: true, fullName: true, cpf: true },
        where: { cpf }
    });
};

export const getAdminsByName = async (name: string) => {
    return await adminRepository.find({
        select: { email: true, fullName: true, cpf: true },
        where: { fullName: ILike(`%${name}%`) }
    });
};

export const getDoctorsByExamName = async (examName: string) => {
    return await adminRepository.find({
        where: { exams: { exam_name: ILike(`%${examName}%`) }, isDoctor: true },
        relations: ['exams'],
        select: { id: true, fullName: true }
    });
};