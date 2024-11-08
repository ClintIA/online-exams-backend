import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {
    deletePatientService,
    findPatientByCpf,
    listPatientByTenant,
    updatePatientService
} from "../services/patientService";


export const listPatients = async (req: Request, res: Response) => {
        /*
     #swagger.tags = ['Admin']
     #swagger.summary = 'List All Patients by Tenant'
     #swagger.description = 'List All Patient from a tenant'
     */
    const { take, skip,patientCpf, patientName } = req.query;
    const tenantId = req.tenantId;
    const filters = {
        patientCpf: patientCpf ? patientCpf as string : undefined,
        patientName: patientName? patientName as string : undefined,
    };
    if(!tenantId)  {
        throw new Error('Tenant Não encontrado');
    }
    const numberOfExamToTake = take ? take : 1000
    const numberOfExamToSkip = skip ? skip : 0
    try {
        const result = await listPatientByTenant(filters,tenantId, parseInt(numberOfExamToTake as string), parseInt(numberOfExamToSkip as string))
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
}

export const updatePatient = async (req: Request, res: Response) => {
    /*
 #swagger.tags = ['Admin/Patient']
 #swagger.summary = 'Update a Patients'
 #swagger.description = 'Route to update a Patient from a tenant'
 */
    const { full_name, cpf, dob, email, phone, address, canal, gender, health_card_number } = req.body;
    const tenantId = req.tenantId;
    if(!tenantId)  {
        throw new Error('Tenant Não encontrado');
    }
    try {
        const result = await updatePatientService({
            full_name,
            cpf,
            dob: new Date(dob),
            email,
            phone,
            address,
            canal,
            gender,
            health_card_number
        })
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
}
export const deletePatient = async (req: Request, res: Response) => {
    /*
 #swagger.tags = ['Admin/Patient']
 #swagger.summary = 'Update a Patients'
 #swagger.description = 'Route to update a Patient from a tenant'
 */
    const { patientId } = req.params;
    const tenantId = req.tenantId;
    if(!tenantId)  {
        throw new Error('Tenant Não encontrado');
    }
    try {
        const result = await deletePatientService(parseInt(patientId as string));
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