import {Request, Response} from 'express';
import {customErrorResponse, errorResponse, successResponse} from '../utils/httpResponses';
import {getAdmins, getAdminByCPF, getAdminsByName, getDoctors, getDoctorsByExamName} from "../services/adminService";
interface PaginationQuery {
    page?: string;
    take?: string;
    skip?: string;
}

interface GetDoctorsResult {
    doctors: any[];
    total: number;
}

export const getAdminListController =  async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'List All Admins by Tenant'
    #swagger.description = 'Get All Admins from a Tenant'
    */
    try {
        const tenantId = req.headers['x-tenant-id'];
        const result = await getAdmins(parseInt(tenantId as string));
        return successResponse(res, result);

    } catch (error) {
        return errorResponse(res, error);
    }
}
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
        const result: GetDoctorsResult = await getDoctors(
            numericParams.tenantId,
            numericParams.take,
            numericParams.skip
        );

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

export const getAdminsByCPFController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Get Admin info by CPF'
    #swagger.description = 'Filter Admins with CPF '
    */
   try {
           const tenantId = req.tenantId!;
           const { cpf } = req.query;
           const result = await getAdminByCPF(cpf as string, tenantId)
       if(!result) {
           return customErrorResponse(res, 'Admin não encontrado');
       }
       return successResponse(res, result);

   }  catch (error) {
    return errorResponse(res, error);

    }
}
export const getAdminsByNameController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Get Admin info with Name '
    #swagger.description = 'Get Admin infos filter by Name'
    */
   try {
       const tenantId = req.tenantId!;
       const { fullName } = req.query;

       const result = await getAdminsByName(fullName as string, tenantId)
       return successResponse(res, result);

   } catch (error) {
       return errorResponse(res, error);

   }
}

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