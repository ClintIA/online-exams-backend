import { Request, Response } from 'express';
import { listPatientExams, createPatientExam, updatePatientExam, deletePatientExam } from '../services/patientExamService';
import { successResponse, errorResponse } from '../utils/httpResponses';
import { parseValidInt } from '../utils/parseValidInt';
import { sendExamReadyNotification } from './notificationController';

interface GetExamssResult {
    exams: any[];
    total: number;
}
export const listPatientExamsController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Admin/PatientExam']
     #swagger.summary = 'List Patient Exams with filters'
     #swagger.description = 'Filters by Date, CPF, Date(YYYY-MM-DD), status, Patient ID, Tenant ID)'
     */
        try {
            const tenantId = req.headers['x-tenant-id'];
            const patientId = req.headers['x-patient-id'];
            const { take, skip,patientCpf, startDate, endDate, status, patientName } = req.query;

            const filters = {
                patientCpf: patientCpf ? patientCpf as string : undefined,
                startDate: startDate ? startDate as string : undefined,
                endDate: endDate ? endDate as string : undefined,
                status: status as 'Scheduled' | 'InProgress' | 'Completed',
                patientName: patientName as string,
                patientId: patientId ? parseInt(patientId as string) : undefined,
                tenantId: tenantId ? parseInt(tenantId as string) : undefined,
            };
            const numberOfExamToTake = take ? take : 10
            const numberOfExamToSkip = skip ? skip : 0

            const exams: GetExamssResult = await listPatientExams(filters, parseInt(numberOfExamToTake as string), parseInt(numberOfExamToSkip as string));

            const transformedData = exams.exams.reduce((acc: any, exam: any) => {
                const tenantIndex = acc.findIndex((tenant: any) => tenant.id === exam.exam.tenant.id);
            const examData = {
                id: exam.id,
                patient: exam.patient.full_name,
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
        const remaining = exams.total - exams.exams.length;

        if(transformedData.length === 0) {
            return successResponse(res, null, 'Não foram encontrados exames para essa pesquisa');
        }
        return successResponse(res, { exames: transformedData,
            pagination: {
                total: exams.total,
                take: take,
                skip: skip,
                remaining
            }}, 'Exames listados com sucesso');    } catch (error) {
        return errorResponse(res, error);
    }
};



export const createPatientExamController = async (req: Request, res: Response) => {

    /*
    #swagger.tags = ['Admin/PatientExam']
    #swagger.summary = 'Create Patient Exam'
    #swagger.description = 'Booking a exam to a patient'
*/
    try {
        const { patientId, examId, examDate, doctorId, userId } = req.body;

        const result = await createPatientExam({ patientId, examId, examDate: new Date(examDate), userId, doctorId });
        return successResponse(res, result, 'Exame do paciente criado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const updatePatientExamController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin/PatientExam']
    #swagger.summary = 'Update Patient Exam'
    #swagger.description = 'Save link and update status in exam scheduled'
    */
    try {
        const tenantId = req.tenantId!;
        const examId = parseValidInt(req.params.patientExamId);
        if (examId === null) {
            return errorResponse(res, new Error("Invalid examId: not a number"), 400);
        }
        const { status, link } = req.body;

        const result = await updatePatientExam(examId, { status, link });

        await sendExamReadyNotification({
            name: result.patientName,
            phoneNumber: result.patientPhone!,
            tenantId: tenantId
        });
        
        return successResponse(res, result, 'Exame do paciente atualizado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const deletePatientExamController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin/PatientExam']
    #swagger.summary = 'Delete Patient Exam'
    #swagger.description = 'Delete a Scheduled Exam'
    */
    try {
        const examId = parseValidInt(req.params.examId);
        if (examId === null) {
            return errorResponse(res, new Error("Invalid examId: not a number"), 400);
        }
        const tenantId = req.tenantId!;

        await deletePatientExam(examId, tenantId);
        return successResponse(res, 'Exame do paciente deletado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};