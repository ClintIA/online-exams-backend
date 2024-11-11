import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { CreateExamDTO } from '../types/dto/tenantExam/createExamDTO';
import { ListExamsDTO } from '../types/dto/tenantExam/listExamsDTO';
import { UpdateExamDTO } from '../types/dto/tenantExam/updateExamDTO';

export const createExam = async (examData: CreateExamDTO) => {
    await tenantExamsRepository.save({
        exam_name: examData.exam_name,
        price: examData.price,
        doctorPrice: examData.doctorPrice,
        tenant: { id: examData.tenantId }
    });
    return { message: 'Exame criado com sucesso' };
};

export const getExams = async (filters: ListExamsDTO) => {
    return await tenantExamsRepository.find({
        where: { tenant: { id: filters.tenantId } }
    });
};

export const updateExam = async (examId: number, examData: UpdateExamDTO) => {
    const result = await tenantExamsRepository.update(
        { id: examId, tenant: { id: examData.tenantId } },
        {
            exam_name: examData.exam_name,
            price: examData.price,
            doctorPrice: examData.doctorPrice
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
