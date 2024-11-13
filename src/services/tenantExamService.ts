import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { CreateExamDTO } from '../types/dto/tenantExam/createExamDTO';
import { ListExamsDTO } from '../types/dto/tenantExam/listExamsDTO';
import { UpdateExamDTO } from '../types/dto/tenantExam/updateExamDTO';
import {findDoctorsById} from "./adminService";
import {Admin} from "../models/Admin";

export const createExam = async (examData: CreateExamDTO) => {
    const doctors: Admin[] = [];

    for (const doctorId of examData.doctors) {
        const doctor =  await findDoctorsById(parseInt(doctorId));
        if(doctor) {
            doctors.push(doctor);
        }
    }

    await tenantExamsRepository.save({
        exam_name: examData.exam_name,
        price: examData.price,
        doctorPrice: examData.doctorPrice,
        tenant: { id: examData.tenantId },
        doctors: doctors
    });
    return { message: 'Exame criado com sucesso' };
};

export const getExams = async (filters: ListExamsDTO) => {
    return await tenantExamsRepository.find({
        where: { tenant: { id: filters.tenantId } }, relations: ['doctors']
    });
};

export const updateExam = async (examId: number, examData: UpdateExamDTO) => {
    const doctors: Admin[] = [];

    for (const doctorId of examData.doctors) {
        const doctor =  await findDoctorsById(parseInt(doctorId));
        if(doctor) {
            doctors.push(doctor);
        }
    }
    const result = await tenantExamsRepository.update(
        { id: examId, tenant: { id: examData.tenantId } },
        {
            exam_name: examData.exam_name,
            price: examData.price,
            doctorPrice: examData.doctorPrice,
            doctors: doctors
        }
    );

    if (result.affected === 0) {
        throw new Error('Exame não encontrado');
    }

    return { message: 'Exame atualizado com sucesso' };
};

export const deleteExam = async (examId: number, tenantId: number) => {
    const result = await tenantExamsRepository.delete({
        id: examId,
        tenant: { id: tenantId },
    });

    if (result.affected === 0) {
        throw new Error('Exame não encontrado');
    }

    return { message: 'Exame deletado com sucesso' };
};
