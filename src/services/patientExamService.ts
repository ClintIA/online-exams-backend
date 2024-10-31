import {Between, Like} from 'typeorm';
import {patientExamsRepository} from '../repositories/patientExamsRepository';
import {tenantExamsRepository} from '../repositories/tenantExamsRepository';
import {findDoctorById} from "./adminService";
import {PatientExams} from '../models/PatientExams';

interface FilterParams {
    startDate?: string;
    endDate?: string;
    status: 'Scheduled' | 'InProgress' | 'Completed';
    patientName?: string;
    patientId?: number;
    tenantId?: number;
}

export const listPatientExams = async (filters: FilterParams): Promise<PatientExams[]> => {
    const whereCondition: any = {};

    // Handle tenant filtering
    if (filters.tenantId) {
        whereCondition.exam = { tenant: { id: filters.tenantId } };
    }

    // Handle patient filtering
    if (filters.patientId || filters.patientName) {
        whereCondition.patient = {
            ...(filters.patientId && { id: filters.patientId }),
            ...(filters.patientName && { full_name: Like(`%${filters.patientName}%`) })
        };
    }

    // Handle date filtering
    if (filters.startDate || filters.endDate) {
        const getFormattedDate = (date: string, offsetDays: number = 0): string => {
            const dateObj = new Date(date);
            dateObj.setDate(dateObj.getDate() + offsetDays);
            return dateObj.toISOString().split('T')[0];
        };

        if (filters.startDate && filters.endDate) {
            whereCondition.examDate = Between(filters.startDate, getFormattedDate(filters.endDate, 1)
            );
        } else if (filters.startDate) {
            whereCondition.examDate = Between(
                filters.startDate,
                getFormattedDate(filters.startDate, 1)
            );
        } else if (filters.endDate) {
            whereCondition.examDate = Between(
                getFormattedDate(filters.endDate, -1),
                filters.endDate
            );
        }
    }
    // Handle status filtering
    if (filters.status) {
        whereCondition.status = filters.status;
    }

    return await patientExamsRepository.find({
        where: whereCondition,
        relations: ['patient', 'exam', 'exam.tenant'],
        order: { createdAt: 'DESC' }
    });
};

export const deletePatientExam = async (examId: number, tenantId: number) => {
    const exam = await patientExamsRepository.findOne({
        where: {
            id: examId,
            exam: {tenant: {id: tenantId}},
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
    const exam = await patientExamsRepository.update({ id: examId }, {
         status: examData.status,
         link: examData.link,
     });
    if (!exam) {
        throw new Error('Erro ao salvar link ou Exame não encontrado');
    }

    Object.assign(exam, examData);

    if (examData.status === 'Completed' && !examData.link) {
        throw new Error('Link do exame é necessário para status de concluído');
    }
    return {message: 'Exame atualizado com sucesso'};
};

export const createPatientExam = async (
    examData: {
        patientId: number;
        examId: number;
        examDate: Date;
        userId: number;
        doctorId: number;
    },
    tenantId: number
) => {
    const exam = await tenantExamsRepository.findOne({
        where: {id: examData.examId, tenant: {id: tenantId}},
    });

    if (!exam) {
        throw new Error('Exame não encontrado');
    }
    const doctor = await findDoctorById(examData.doctorId, tenantId)
    let newPatientExam: PatientExams;
     if(doctor) {
          newPatientExam = patientExamsRepository.create({
             exam,
             patient: { id: examData.patientId },
             createdBy: { id: examData.userId },
             examDate: examData.examDate,
             status: 'Scheduled',
             doctor: doctor
         });
     } else {
          newPatientExam = patientExamsRepository.create({
             exam,
             patient: { id: examData.patientId },
             createdBy: { id: examData.userId },
             examDate: examData.examDate,
             status: 'Scheduled',
         });
     }
    await patientExamsRepository.save(newPatientExam);
    return { message: 'Exame do paciente criado com sucesso' };
};

