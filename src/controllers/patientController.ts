import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/httpResponses';
import { findPatientByCpf, listPatientByTenant} from "../services/patientService";


export const listPatients = async (req: Request, res: Response) => {
        /*
     #swagger.tags = ['Admin']
     #swagger.summary = 'List All Patients by Tenant'
     #swagger.description = 'List All Patient from a tenant'
     */
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

export const findPatientByCPF = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin/Patient']
    #swagger.summary = 'Find a Patient by CPF'
    #swagger.description = 'Get patient infos'
    */
    const { cpf } = req.query;
    try {
        const patient = await findPatientByCpf(cpf as string);
        if (!patient) {
            return errorResponse(res, new Error('Paciente não encontrado'), 404);
        }

        const { password, ...patientInfoWithoutPassword } = patient;

        return successResponse(res, patientInfoWithoutPassword);
    } catch (error) {
        return errorResponse(res, error);
    }
}