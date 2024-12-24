import {doctorRepository} from "../repositories/doctorRepository";
import {ILike} from "typeorm";
import bcrypt from "bcryptjs";
import {tenantRepository} from "../repositories/tenantRepository";
import {RegisterDoctorDTO} from "../types/dto/doctor/registerDoctorDTO";
import {PaginationQuery} from "../types/dto/doctor/paginationQuery";


export const getDoctors = async ({ tenantId, take = 10, skip = 0 }: PaginationQuery) => {
    const [doctors, total] = await doctorRepository.findAndCount({
        select: { id: true, fullName: true, email: true, cep: true, cpf: true, role:true, CRM: true,occupation: true, phone: true, created_at: true },
        relations: ['exams'],
        take,
        skip,
        where: { tenant: { id: tenantId } }
    });
    return { doctors, total };
};
export const registerDoctor = async (doctorData: RegisterDoctorDTO, tenantId: number) => {
    const hashedPassword = await bcrypt.hash(doctorData.password!, 10);
    const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
    if(!tenant){
        throw new Error('Tenant not found!');
    }
    const newDoctor = doctorRepository.create({
        ...doctorData,
        password: hashedPassword,
        tenant: tenant,
        role: 'doctor'
    });
    try {
        const result = await doctorRepository.save(newDoctor);
        return { data: result, message: 'Médico registrado com sucesso' };
    } catch (error) {
        throw new Error("Erro ao registrar médico: Verifique se o email ou CPF já existe.");
    }
};

export const getDoctorsByExamName = async (examName: string) => {
    return await doctorRepository.find({
        where: { exams: { exam_name: ILike(`%${examName}%`) } },
        relations: ['exams'],
        select: { id: true, fullName: true }
    });
};

export const findDoctorsById = async (id: number) => {
    return await doctorRepository.findOne({
        where: {
            id
        }
    })
}
export const findDoctorsByEmail = async (email: string) => {
    return await doctorRepository.findOne({where: {email}, relations: ['tenant']});

}

export const updateDoctorService = async (doctorID: number, updateData: RegisterDoctorDTO) => {
    const result = await doctorRepository.update(doctorID, updateData);

    if (result.affected === 0) throw new Error('Médico não encontrado');

    return { message: 'Médico atualizado com sucesso' };
};

export const deleteDoctorService = async (doctorID: number) => {
    const result = await doctorRepository.delete(doctorID);

    if (result.affected === 0) throw new Error('Médico não encontrado');

    return { message: 'Médico deletado com sucesso' };
};