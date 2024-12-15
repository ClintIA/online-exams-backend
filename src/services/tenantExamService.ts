import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { CreateExamDTO } from '../types/dto/tenantExam/createExamDTO';
import { ListExamsDTO } from '../types/dto/tenantExam/listExamsDTO';
import { UpdateExamDTO } from '../types/dto/tenantExam/updateExamDTO';
import {findDoctorsById} from "./adminService";
import {Admin} from "../models/Admin";
import {updatePatient} from "../controllers/patientController";
import {updateExamController} from "../controllers/tenantExamController";
import {tenantMiddleware} from "../middlewares/tenantMiddleware";

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
export const addDoctorToExam = async (examsID: string[], doctor: Admin) => {
    for (const id of examsID) {
        const doctors: Admin[] = []
    await tenantExamsRepository.findOne({ where: { id: parseInt(id) } }).then(
            async (result) => {
                if(result) {
                    doctors.push(doctor)
                    await tenantExamsRepository.save(
                    { ...result, doctors: doctors}
                    )
                } else {
                    throw new Error('Erro ao Cadastrar Exame')
                }
            }
        )

    }
    return { message: 'Médico adicionado ao exame com sucesso' };
};

export const updateExam = async (examId: number, examData: UpdateExamDTO) => {
    const doctors: Admin[] = [];

    for (const doctorId of examData.doctors) {
        const doctor =  await findDoctorsById(parseInt(doctorId));
        if(doctor) {
            doctors.push(doctor);
        }
    }
    const updateExam = tenantExamsRepository.create({
        id: examId,
        exam_name: examData.exam_name,
        price: examData.price,
        doctorPrice: examData.doctorPrice,
        doctors: doctors
    })
    const result = await tenantExamsRepository.save(
        updateExam
    );

    if (!result) {
        throw new Error('Exame ao atualizar exame');
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
