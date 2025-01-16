import {Admin} from '../models/Admin';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/jwtHelper';
import {adminRepository} from '../repositories/adminRepository';
import {ILike} from "typeorm";
import {UpdateAdminDTO} from '../types/dto/admin/updateAdminDTO';
import {LoginAdminDTO} from '../types/dto/auth/loginAdminDTO';
import {RegisterAdminDTO} from '../types/dto/auth/registerAdminDTO';
import {tenantRepository} from "../repositories/tenantRepository";
import {findDoctorsByEmail} from "./doctorService";
import { Doctor } from '../models/Doctor';
import {doctorRepository} from "../repositories/doctorRepository";

const findAdminByEmail = async (email: string): Promise<Admin | null> => {
    return await adminRepository.findOne({where: {email}, relations: ['tenant']});
};

/**
 * Registers a new admin by hashing the provided password and associating the admin with a tenant.
 *
 * @param {RegisterAdminDTO} adminData - The registration data containing the admin's details such as email, cpf, and fullName.
 * @param {number} tenantId - The ID of the tenant to associate the new admin with.
 * @returns {Promise<{data: Admin, message: string}>} A promise that resolves to an object containing the saved admin data and a success message.
 *
 * @throws Will throw an error if the tenant is not found or if there is an issue saving the admin (e.g., email or CPF already exists).
 */
export const registerAdmin = async (adminData: RegisterAdminDTO, tenantId: number): Promise<{ data: Admin; message: string; }> => {
    const hashedPassword = await bcrypt.hash(adminData.password!, 10);
    const tenant = await tenantRepository.findOne({where: {id: tenantId}});
    if (!tenant) {
        throw new Error('Tenant not found!');
    }
    const newAdmin = adminRepository.create({
        ...adminData,
        password: hashedPassword,
        tenant: tenant
    });
    try {
        const result = await adminRepository.save(newAdmin);
        return {data: result, message: 'Admin registrado com sucesso'};
    } catch (error) {
        throw new Error("Erro ao registrar admin: Verifique se o email ou CPF já existe.");
    }
};

/**
 * Authenticates an admin or doctor by their email and password.
 *
 * @param {LoginAdminDTO} loginData - The login credentials containing the user's email and password.
 * @returns {Promise<string>} A promise that resolves to a session token if authentication is successful.
 *
 * @throws Will throw an error if the user is not found or if the password is invalid.
 */
export const loginAdmin = async (loginData: LoginAdminDTO): Promise<string> => {
    let user: Admin | Doctor | null = await findAdminByEmail(loginData.user) || await findDoctorsByEmail(loginData.user);
    if (!user) throw new Error('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) throw new Error('Senha inválida');

    const token = generateToken(user.id, user.role, user.tenant.id);
    user.sessionToken = token;

    if (user instanceof Admin) {
        await adminRepository.save(user);
    } else {
        await doctorRepository.save(user);
    }

    return token;
};


export const getAdmins = async (tenantId: number) => {
    return await adminRepository.find({
        select: { id: true, fullName: true, cpf: true, email: true, cep: true, phone: true, created_at: true, role: true },
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
    const admin = await adminRepository.findOne({ where: { id: adminId}});

    if(admin?.role === 'master') {
        throw new Error("Não é possível deletar o admin selecionado")
    }
    const result = await adminRepository.softDelete(adminId);

    if (result.affected === 0) throw new Error('Admin não encontrado');
    
    return { message: 'Admin deletado com sucesso' };
};
