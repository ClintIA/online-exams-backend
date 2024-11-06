import {Like} from 'typeorm';
import {patientExamsRepository} from '../repositories/patientExamsRepository';
import {tenantExamsRepository} from '../repositories/tenantExamsRepository';
import {PatientExams} from '../models/PatientExams';
import {handleFilterDate} from "../utils/handleDate";

interface FilterParams {
    startDate?: string;
    endDate?: string;
    status: 'Scheduled' | 'InProgress' | 'Completed';
    patientName?: string;
    patientId?: number;
    tenantId?: number;
    patientCpf?: string
}

export const listPatientExams = async (filters: FilterParams, take: number = 10, skip: number = 0) => {
    const whereCondition: any = {};

    if (filters.tenantId) {
        whereCondition.exam = { tenant: { id: filters.tenantId } };
    }
    if (filters.patientCpf) {
        whereCondition.patient = { cpf: filters.patientCpf  };
    }
    if (filters.patientId || filters.patientName) {
        whereCondition.patient = {
            ...(filters.patientId && { id: filters.patientId }),
            ...(filters.patientName && { full_name: Like(`%${filters.patientName}%`) })
        };
    }
    if (filters.startDate || filters.endDate) {
        whereCondition.examDate = handleFilterDate(filters,1)
    }
    if (filters.status) {
        whereCondition.status = filters.status;
    }

    const [ exams, total ] = await patientExamsRepository.findAndCount({
        where: whereCondition,
        take: take,
        skip: skip,
        relations: ['patient', 'exam', 'exam.tenant'],
        order: { examDate: 'DESC' }
    });

    return { exams, total };
};

export const deletePatientExam = async (examId: number, tenantId: number) => {
    const deleteResult = await patientExamsRepository.delete({
        id: examId,
        exam: { tenant: { id: tenantId } }
    });

    if (!deleteResult.affected) throw new Error('Exame não encontrado');
    return { message: "Exame deletado com sucesso" };
};

export const updatePatientExam = async (
    examId: number,
    examData: { status?: 'Scheduled' | 'InProgress' | 'Completed'; link?: string }
) => {
    if (examData.status === 'Completed' && !examData.link) {
        throw new Error('Link do exame é necessário para status de concluído');
    }

    const updateResult = await patientExamsRepository.update({ id: examId }, {
        status: examData.status,
        link: examData.link
    });

    if (!updateResult.affected) throw new Error('Erro ao salvar link ou Exame não encontrado');

    return { message: 'Exame atualizado com sucesso' };
};

export const createPatientExam = async (
    examData: {
        patientId: number;
        examId: number;
        examDate: Date;
        userId: number;
        doctorId?: number;
    },
) => {
    const newPatientExam = patientExamsRepository.create({
        exam: { id: examData.examId },
        patient: { id: examData.patientId },
        createdBy: { id: examData.userId },
        examDate: examData.examDate,
        status: 'Scheduled',
        ...(examData.doctorId && { doctor: { id: examData.doctorId } })
    });

    await patientExamsRepository.save(newPatientExam);
    return { message: 'Exame do paciente criado com sucesso' };
};


