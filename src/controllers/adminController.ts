import {Request, Response} from 'express';
import {errorResponse, successResponse} from '../utils/httpResponses';
import {getAdmins, getAdminsByCPF, getAdminsByName, getDoctorsByExamName} from "../services/adminService";

export const getAdminListController =  async (req: Request, res: Response) => {
    try {
        const tenantId = req.headers['x-tenant-id'];
        const result = await getAdmins(parseInt(tenantId as string));
        return successResponse(res, result);

    } catch (error) {
        return errorResponse(res, error);
    }
}

export const getAdminsByCPFController = async (req: Request, res: Response) => {

   try {
           const tenantId = req.tenantId!;
           const { adminCpf } = req.body;
           const result = await getAdminsByCPF(adminCpf, tenantId)
       return successResponse(res, result);

   }  catch (error) {
    return errorResponse(res, error);

    }
}
export const getAdminsByNameController = async (req: Request, res: Response) => {
   try {
       const tenantId = req.tenantId!;
       const { fullName } = req.body;

       const result = await getAdminsByName(fullName, tenantId)
       return successResponse(res, result);

   } catch (error) {
       return errorResponse(res, error);

   }
}

export const getDoctorsByExamNameController = async (req: Request, res: Response) => {
    try {
        const { examName } = req.params;
        const result = await getDoctorsByExamName(examName);
        return successResponse(res, result, 'Doutores associados ao exame listados com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};