import {tenantExamsRepository} from '../repositories/tenantExamsRepository';

export const createExam = async (examData: { exam_name: string, price: number }, tenantId: number) => {
    await tenantExamsRepository.save({
        ...examData,
        tenant: { id: tenantId }
    });
    return { message: 'Exame criado com sucesso' };
};

export const getExams = async (tenantId: number) => {
    return await tenantExamsRepository.find({
        where: {tenant: {id: tenantId}},
        select: ['id', 'exam_name', 'price', 'created_at']
    });
};

export const updateExam = async (examId: number, examData: { exam_name: string, price: number }, tenantId: number) => {
    const result = await tenantExamsRepository.update(
        { id: examId, tenant: { id: tenantId } },
        examData
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
