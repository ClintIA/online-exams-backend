import { Request, Response } from 'express';
import { listPatientExams, createPatientExam, updatePatientExam, deletePatientExam } from '../services/patientExamService';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {findPatientByCpf} from "../services/patientService";

export const listPatientExamsController = async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'];
        const { date, status, patientName, patientId } = req.query;

        if (!tenantId && !patientId) {
            return errorResponse(res, new Error('É necessário passar o tenantId ou patientId'), 400);
        }

        const filters = {
            date: date ? new Date(date as string) : undefined,
            status: status as 'Scheduled' | 'InProgress' | 'Completed',
            patientName: patientName as string,
            patientId: patientId ? parseInt(patientId as string) : undefined,
            tenantId: tenantId ? parseInt(tenantId as string) : undefined,
        };

        const exams = await listPatientExams(filters);

        const transformedData = exams.reduce((acc: any, exam: any) => {
            const tenantIndex = acc.findIndex((tenant: any) => tenant.id === exam.exam.tenant.id);
            
            const examData = {
                id: exam.id,
                link: exam.link,
                createdAt: exam.createdAt,
                examDate: exam.examDate,
                uploadedAt: exam.uploadedAt,
                status: exam.status,
                exam: {
                    id: exam.exam.id,
                    exam_name: exam.exam.exam_name
                }
            };

            if (tenantIndex > -1) {
                acc[tenantIndex].patientExams.push(examData);
            } else {
                acc.push({
                    id: exam.exam.tenant.id,
                    name: exam.exam.tenant.name,
                    patientExams: [examData]
                });
            }

            return acc;
        }, []);

        return successResponse(res, { tenant: transformedData }, 'Exames listados com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};



export const createPatientExamController = async (req: Request, res: Response) => {
    try {
        const { patientId, examId, examDate, doctorId, userId } = req.body;
        const tenantId = req.tenantId!;

        const result = await createPatientExam({ patientId, examId, examDate: new Date(examDate), userId, doctorId }, tenantId);
        return successResponse(res, result, 'Exame do paciente criado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const updatePatientExamController = async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.examId);
        const { status, link } = req.body;
        const tenantId = req.tenantId!;

        const result = await updatePatientExam(examId, { status, link }, tenantId);
        return successResponse(res, result, 'Exame do paciente atualizado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const deletePatientExamController = async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.examId);
        const tenantId = req.tenantId!;

        await deletePatientExam(examId, tenantId);
        return successResponse(res, 'Exame do paciente deletado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};
