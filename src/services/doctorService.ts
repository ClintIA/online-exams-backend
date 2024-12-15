import {GetDoctorsDTO} from "../types/dto/admin/getDoctorsDTO";
import {doctorRepository} from "../repositories/doctorRepository";
import {ILike} from "typeorm";
import {Request, Response} from "express";
import {errorResponse, successResponse} from "../utils/httpResponses";

interface PaginationQuery {
    page?: string;
    take?: string;
    skip?: string;
}

interface GetDoctorsResult {
    doctors: any[];
    total: number;
}
export const getDoctors = async ({ tenantId, take = 10, skip = 0 }: GetDoctorsDTO) => {
    const [doctors, total] = await doctorRepository.findAndCount({
        select: { id: true, fullName: true, cpf: true, CRM: true,occupation: true, phone: true, created_at: true },
        take,
        skip,
        where: { tenant: { id: tenantId } }
    });
    return { doctors, total };
};

export const getDoctorsByExamNameController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Get Doctors by Exam  '
    #swagger.description = 'Filter Doctors by exam name'
    */
    try {
        const { examName } = req.query;
        const result = await getDoctorsByExamName(examName as string);
        return successResponse(res, result, 'Doutores associados ao exame listados com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};
export const getDoctorsListController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'List All Doctors by Tenant with pagination'
    #swagger.description = 'Get All Doctors from a Tenant with pagination By default list 10'
    */
    try {
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId || typeof tenantId !== 'string') {
            return errorResponse(res, new Error('Tenant ID inválido ou não informado'), 400);
        }

        const { page = '1', take = '10', skip = '0' } = req.query as PaginationQuery;

        const numericParams = {
            tenantId: parseInt(tenantId),
            take: parseInt(take),
            skip: parseInt(skip),
            page: parseInt(page)
        };

        if (Object.values(numericParams).some(isNaN)) {
            return errorResponse(res, new Error('Invalid pagination parameters'), 400);
        }
        const result: GetDoctorsResult = await getDoctors({
            tenantId: numericParams.tenantId,
            take: numericParams.take,
            skip: numericParams.skip
        });

        const remaining = result.total - result.doctors.length;

        const message = `Mostrando ${result.doctors.length} de ${result.total} médicos (${remaining} faltando)`;

        return successResponse(res, {
            data: result.doctors,
            pagination: {
                total: result.total,
                page: numericParams.page,
                take: numericParams.take,
                skip: numericParams.skip,
                remaining
            }
        }, message);

    } catch (error) {
        console.error('Error in getDoctorsListController', error);
        return errorResponse(res, error);
    }
};
export const getDoctorsByExamName = async (examName: string) => {
    return await doctorRepository.find({
        where: { exams: { exam_name: ILike(`%${examName}%`) } },
        relations: ['exams'],
        select: { id: true, fullName: true }
    });
};