import { Tenant } from '../models/Tenant';
import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { tenantRepository } from '../repositories/tenantRepository';

const findTenantById = async (tenantId: number): Promise<Tenant | null> => {
    return await tenantRepository.findOne({ where: { id: tenantId } });
};

export const createExam = async (examData: { exam_name: string, price: number }, tenantId: number) => {
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    const exam = await tenantExamsRepository.findOne({
        where: {
            exam_name: examData.exam_name,
            tenant: { id: tenantId }
        }
    });
    if (exam) {
        throw new Error('Exame já cadastrado');
    }

    const newExam = tenantExamsRepository.create({
        ...examData,
        tenant
    });

    await tenantExamsRepository.save(newExam);
    return { message: 'Exame criado com sucesso' };
};

export const getExams = async (tenantId: number) => {
    const exams = await tenantExamsRepository.find({
        where: { tenant: { id: tenantId } },
        select: ['id', 'exam_name', 'price', 'created_at']
    });
    return exams;
};

export const updateExam = async (examId: number, examData: { exam_name: string, price: number }, tenantId: number) => {
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    const exam = await tenantExamsRepository.findOne({
        where: {
            id: examId,
            tenant: { id: tenantId }
        }
    });
    if (!exam) {
        throw new Error('Exame não encontrado');
    }

    Object.assign(exam, examData);
    await tenantExamsRepository.save(exam);

    return { message: 'Exame atualizado com sucesso' };
};

export const deleteExam = async (examId: number, tenantId: number) => {
    const tenant = await findTenantById(tenantId);
    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    const exam = await tenantExamsRepository.findOne({
        where: {
            id: examId,
            tenant: { id: tenantId }
        }
    });
    if (!exam) {
        throw new Error('Exame não encontrado');
    }

    await tenantExamsRepository.remove(exam);
};
