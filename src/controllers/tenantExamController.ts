import { Request, Response } from 'express';
import { createExam, getExams, updateExam, deleteExam } from '../services/tenantExamService';
import { successResponse, errorResponse } from '../utils/httpResponses';

export const createExamController = async (req: Request, res: Response) => {
    try {
        const { exam_name, price } = req.body;
        const tenantId = req.tenantId!;
        const result = await createExam({ exam_name, price }, tenantId);
        return successResponse(res, result, 'Exame criado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const getExamsController = async (req: Request, res: Response) => {
    try {
        const tenantId = req.tenantId!;
        const result = await getExams(tenantId);
        return successResponse(res, result, 'Exames listados com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const updateExamController = async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.clinicExamId);
        const { exam_name, price } = req.body;
        const tenantId = req.tenantId!;
        const result = await updateExam(examId, { exam_name, price }, tenantId);
        return successResponse(res, result, 'Exame atualizado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const deleteExamController = async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.clinicExamId);
        const tenantId = req.tenantId!;
        await deleteExam(examId, tenantId);
        return successResponse(res, { message: 'Exame deletado com sucesso' });
    } catch (error) {
        return errorResponse(res, error);
    }
};
