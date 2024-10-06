import {Request, Response} from 'express';
import {errorResponse} from '../utils/httpResponses';
import {getAdmins, getAdminsByCPF, getAdminsByName} from "../services/adminService";

export const getAdminListController =  async (req: Request, res: Response) => {
    try {
        const tenantId = req.tenantId!;
        return await getAdmins(tenantId)
    } catch (error) {
        return errorResponse(res, error);
    }
}

export const getAdminsByCPFController = async (req: Request, res: Response) => {

   try {
           const tenantId = req.tenantId!;
           const { cpf } = req.body;
           return await getAdminsByCPF(cpf, tenantId)
        }  catch (error) {
    return errorResponse(res, error);

    }
}
export const getAdminsByNameController = async (req: Request, res: Response) => {
   try {
       const tenantId = req.tenantId!;
       const { fullName } = req.body!;

       return await getAdminsByName(fullName, tenantId)
   } catch (error) {
       return errorResponse(res, error);

   }
}