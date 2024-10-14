import { Like } from 'typeorm';
import { patientExamsRepository } from '../repositories/patientExamsRepository';
import { tenantExamsRepository } from '../repositories/tenantExamsRepository';

export const listPatientExams = async (
    filters: { 
        date?: Date; 
        status?: 'Scheduled' | 'InProgress' | 'Completed'; 
        patientName?: string; 
        patientId?: number; 
        tenantId?: number 
    }) => {
    
    const whereCondition: any = {};

    if (filters.tenantId) {
        whereCondition.exam = { tenant: { id: filters.tenantId } };
    }

    if (filters.patientId) {
        whereCondition.patient = { id: filters.patientId };
    }

    if (filters.date) {
        whereCondition.examDate = filters.date;
    }

    if (filters.status) {
        whereCondition.status = filters.status;
    }

    if (filters.patientName) {
        whereCondition.patient = { full_name: Like(`%${filters.patientName}%`) };
    }

    const exams = await patientExamsRepository.find({
        where: whereCondition,
        relations: ['patient', 'exam', 'exam.tenant'],
        order: { createdAt: 'DESC' }
    });

    return exams;
};




export const deletePatientExam = async (examId: number, tenantId: number) => {
    const exam = await patientExamsRepository.findOne({
        where: {
            id: examId,
            exam: { tenant: { id: tenantId } },
        },
    });
    if (!exam) {
        throw new Error('Exame não encontrado');
    }

    await patientExamsRepository.remove(exam);
};

export const updatePatientExam = async (
    examId: number, 
    examData: { status?: 'Scheduled' | 'InProgress' | 'Completed'; link?: string }, 
    tenantId: number
) => {
    const exam = await patientExamsRepository.findOne({
        where: {
            id: examId,
            exam: { tenant: { id: tenantId } },
        },
    });
    
    if (!exam) {
        throw new Error('Exame não encontrado');
    }

    Object.assign(exam, examData);

    if (examData.status === 'Completed' && !exam.link) {
        throw new Error('Link do exame é necessário para status de concluído');
    }

    await patientExamsRepository.save(exam);
    return { message: 'Exame atualizado com sucesso' };
};

export const createPatientExam = async (
    examData: { 
        patientId: number; 
        examId: number; 
        examDate: Date; 
        createdBy: number 
    }, 
    tenantId: number
) => {
    const exam = await tenantExamsRepository.findOne({
        where: { id: examData.examId, tenant: { id: tenantId } },
    });

    if (!exam) {
        throw new Error('Exame não encontrado');
    }

    const newPatientExam = patientExamsRepository.create({
        exam,
        patient: { id: examData.patientId },
        createdBy: { id: examData.createdBy },
        examDate: examData.examDate,
        status: 'Scheduled',
    });

    await patientExamsRepository.save(newPatientExam);
    return { message: 'Exame do paciente criado com sucesso' };
};

