import { Admin } from '../models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtHelper';
import { adminRepository } from '../repositories/adminRepository';
import { ILike } from "typeorm";
import { GetDoctorsDTO } from '../types/dto/admin/getDoctorsDTO';
import { UpdateAdminDTO } from '../types/dto/admin/updateAdminDTO';
import { LoginAdminDTO } from '../types/dto/auth/loginAdminDTO';
import { RegisterAdminDTO } from '../types/dto/auth/registerAdminDTO';
import {tenantRepository} from "../repositories/tenantRepository";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email }, relations: ['tenant'] });
};

export const findDoctorsById = async (id: number): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { id } });
};

export const registerAdmin = async (adminData: RegisterAdminDTO, tenantId: number) => {
    const hashedPassword = await bcrypt.hash(adminData.password!, 10);
    const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
    if(!tenant){
        throw new Error('Tenant not found!');
    }
    const newAdmin = adminRepository.create({
        ...adminData,
        password: hashedPassword,
        tenant: tenant
    });
    try {
        await adminRepository.save(newAdmin);
        return { message: 'Admin registrado com sucesso' };
    } catch (error) {
        throw new Error("Erro ao registrar admin: Verifique se o email ou CPF já existe.");
    }
};

export const loginAdmin = async (loginData: LoginAdminDTO) => {
    const admin = await findAdminByEmail(loginData.email);
    if (!admin) throw new Error('Admin não encontrado');

    const isPasswordValid = await bcrypt.compare(loginData.password, admin.password);
    if (!isPasswordValid) throw new Error('Senha inválida');

    const token = generateToken(admin.id, true, admin.tenant.id);
    admin.sessionToken = token;

    await adminRepository.save(admin);
    return token;
};

export const getOnlyAdmins = async (tenantId: number) => {
    return await adminRepository.find({
        select: { id: true, fullName: true, cpf: true, email: true, phone: true, created_at: true },
        where: { tenant: { id: tenantId }, isDoctor: false }
    });
};

export const getDoctors = async ({ tenantId, take = 10, skip = 0 }: GetDoctorsDTO) => {
    const [doctors, total] = await adminRepository.findAndCount({
        select: { id: true, fullName: true, cpf: true, email: true, CRM: true, phone: true, created_at: true },
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

export const updateAdmin = async (adminId: number, updateData: UpdateAdminDTO) => {
    const result = await adminRepository.update(adminId, updateData);

    if (result.affected === 0) throw new Error('Admin não encontrado');
    
    return { message: 'Admin atualizado com sucesso' };
};

export const deleteAdmin = async (adminId: number) => {
    const result = await adminRepository.delete(adminId);

    if (result.affected === 0) throw new Error('Admin não encontrado');
    
    return { message: 'Admin deletado com sucesso' };
};
