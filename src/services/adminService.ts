import {Admin} from '../models/Admin';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/jwtHelper';
import {adminRepository} from '../repositories/adminRepository';
import {ILike} from "typeorm";
import {UpdateAdminDTO} from '../types/dto/admin/updateAdminDTO';
import {LoginAdminDTO} from '../types/dto/auth/loginAdminDTO';
import {RegisterAdminDTO} from '../types/dto/auth/registerAdminDTO';
import {tenantRepository} from "../repositories/tenantRepository";
import {ProfileRole} from "../types/enums/role";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({ where: { email }, relations: ['tenant'] });
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
        const result = await adminRepository.save(newAdmin);
        return { data: result, message: 'Admin registrado com sucesso' };
    } catch (error) {
        throw new Error("Erro ao registrar admin: Verifique se o email ou CPF já existe.");
    }
};

export const loginAdmin = async (loginData: LoginAdminDTO) => {
    const admin = await findAdminByEmail(loginData.email);
    if (!admin) throw new Error('Admin não encontrado');

    const isPasswordValid = await bcrypt.compare(loginData.password, admin.password);
    if (!isPasswordValid) throw new Error('Senha inválida');

    const token = generateToken(admin.id, ProfileRole.admin, admin.tenant.id);
    admin.sessionToken = token;

    await adminRepository.save(admin);
    return token;
};

export const getAdmins = async (tenantId: number) => {
    return await adminRepository.find({
        select: { id: true, fullName: true, cpf: true, email: true, phone: true, created_at: true, role: true },
        where: { tenant: { id: tenantId } }
    });
};


export const getAdminByCPF = async (cpf: string) => {
    return await adminRepository.findOne({
        select: { email: true, fullName: true, cpf: true, role: true },
        where: { cpf }
    });
};

export const getAdminsByName = async (name: string) => {
    return await adminRepository.find({
        select: { email: true, fullName: true, cpf: true, role: true },
        where: { fullName: ILike(`%${name}%`) }
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
