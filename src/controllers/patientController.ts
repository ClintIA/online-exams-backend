import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/httpResponses';
import { findPatientByCpfAndTenant, listPatientByTenant} from "../services/patientService";


export const listPatients = async (req: Request, res: Response) => {
    const tenantId = req.tenantId;
    if(!tenantId)  {
        throw new Error('Tenant Não encontrado');
    }
    try {
        const result = await listPatientByTenant(tenantId)
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
}

export const findPatientByCPFAndTenant = async (req: Request, res: Response) => {
    const { cpf } = req.body;
    const tenantId = req.tenantId!;

    try {
     const result = await findPatientByCpfAndTenant(cpf,tenantId)

        return successResponse(res, result);

    } catch (error) {
        return errorResponse(res, error);
    }
}