import {Between, Like} from 'typeorm';
import {patientExamsRepository} from '../repositories/patientExamsRepository';
import {tenantExamsRepository} from '../repositories/tenantExamsRepository';
import {findDoctorById} from "./adminService";
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

export const listPatientExams = async (filters: FilterParams): Promise<PatientExams[]> => {
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

    return await patientExamsRepository.find({
        where: whereCondition,
        relations: ['patient', 'exam', 'exam.tenant'],
        order: { examDate: 'DESC' }
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

