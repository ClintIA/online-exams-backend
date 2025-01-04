import { Like } from 'typeorm';
import { patientExamsRepository } from '../repositories/patientExamsRepository';
import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { handleFilterDate } from '../utils/handleDate';
import { adminRepository } from '../repositories/adminRepository';
import { patientRepository } from '../repositories/patientRepository';
import {CreatePatientExamDTO, CreatePatientExamWithPatientDTO} from '../types/dto/patientExam/createPatientExamDTO';
import { DeletePatientExamDTO } from '../types/dto/patientExam/deletePatientExamDTO';
import { ListPatientExamsDTO } from '../types/dto/patientExam/listPatientExamsDTO';
import { UpdatePatientExamDTO } from '../types/dto/patientExam/updatePatientExamDTO';
import { UpdateExamAttendanceDTO } from '../types/dto/patientExam/updateExamAttendanceDTO';
import {registerPatient} from "./patientService";
import {generatePassword} from "../utils/passwordGenerator";
import {doctorRepository} from "../repositories/doctorRepository";

export const listPatientExams = async (filters?: ListPatientExamsDTO) => {
    const whereCondition: any = {};

    if (filters?.tenantId) {
        whereCondition.exam = { tenant: { id: filters.tenantId } };
    }
    if (filters?.patientCpf) {
        whereCondition.patient = { cpf: filters.patientCpf };
    }
    if (filters?.patientId || filters?.patientName) {
        whereCondition.patient = {
            ...(filters.patientId && { id: filters.patientId }),
            ...(filters.patientName && { full_name: Like(`%${filters.patientName}%`) })
        };
    }
    if (filters?.startDate || filters?.endDate) {
        whereCondition.examDate = handleFilterDate(filters, 1);
    }
    if (filters?.status) {
        whereCondition.status = filters.status;
    }

    if (filters?.attended) {
        whereCondition.attended = filters.attended;
    }

    if (filters?.doctorID) {
        whereCondition.doctor = { id: filters.doctorID }
    }
    if (filters?.exam_name) {
        whereCondition.exam = { exam_name: filters.exam_name }
    }
    const [exams, total] = await patientExamsRepository.findAndCount({
        where: whereCondition,
        take: filters?.take,
        skip: filters?.skip,
        relations: ['patient', 'exam', 'exam.tenant','doctor'],
        order: { examDate: 'ASC' },
    });
    return { exams, total };
};
export const createPatientExamWithPatient = async (examData: CreatePatientExamWithPatientDTO, tenantId: number) => {
    try {
        const password = generatePassword({
            full_name: examData.patientData.full_name,
            dob: examData.patientData.dob,
        });
        const newPatient = await registerPatient({ ...examData.patientData, password }, tenantId);
        return await createPatientExam({ ...examData, patientId: newPatient.data.id }, tenantId);
    } catch (error) {
        throw new Error('Erro ao criar paciente');
    }
}
export const createPatientExam = async (examData: CreatePatientExamDTO, tenantId: number) => {
    const exam = await tenantExamsRepository.findOne({ where: { id: examData.examId } });
    const patient = await patientRepository.findOne({ where: { id: examData.patientId } });
    const createdBy = await adminRepository.findOne({ where: { id: examData.userId } });
    const doctor = await doctorRepository.findOne({ where: { id: examData.doctorId } });

    if (!exam || !patient || !createdBy) {
        throw new Error('Dados inválidos');
    }

    const newPatientExam = patientExamsRepository.create({
        exam,
        patient,
        createdBy,
        examDate: examData.examDate,
        status: 'Scheduled',
        ...(examData.doctorId && { doctor: { id: examData.doctorId } })
    });
    const result = await patientExamsRepository.save({...newPatientExam, tenant: { id: tenantId}});
    const confirmationData = {
        exam_name: result.exam.exam_name,
        exameDate: result.examDate,
        doctor: doctor?.fullName,
        patientName: result.patient.full_name,
        patientPhone: result.patient.phone
    }
    return { 
        data: confirmationData
    };
};

export const updatePatientExam = async (examId: number, examData: UpdatePatientExamDTO) => {
    if (examData.status === 'Completed' && !examData.link) {
        throw new Error('Link do exame é necessário para status de concluído');
    }

    const updateResult = await patientExamsRepository.update({ id: examId }, examData);

    if (!updateResult.affected) throw new Error('Erro ao salvar link ou Exame não encontrado');

    const updatedExam = await patientExamsRepository.findOne({ where: { id: examId }, relations: ['patient'] });

    if (!updatedExam) throw new Error('Exame não encontrado após atualização');

    return { 
        message: 'Exame atualizado com sucesso', 
        patientName: updatedExam.patient.full_name, 
        patientPhone: updatedExam.patient.phone 
    };
};

export const deletePatientExam = async ({ examId, tenantId }: DeletePatientExamDTO) => {
    const deleteResult = await patientExamsRepository.delete({
        id: examId,
        exam: { tenant: { id: tenantId } }
    });

    if (!deleteResult.affected) throw new Error('Exame não encontrado');
    return { message: 'Exame deletado com sucesso' };
};

export const updateExamAttendance = async (examId: UpdateExamAttendanceDTO['examId'], attended: UpdateExamAttendanceDTO['attended']) => {
    const updateResult = await patientExamsRepository.update({ id: examId }, { attended });

    if (!updateResult.affected) {
        throw new Error('Exame não encontrado ou não atualizado');
    }

    return { message: 'Status de presença atualizado com sucesso' };
};

