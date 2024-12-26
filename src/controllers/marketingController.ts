import {Request, Response} from "express";
import {errorResponse, successResponse} from "../utils/httpResponses";
import {parseValidInt} from "../utils/parseValidInt";
import {
    countPatientByMonthService,
    examPricesService,
    countInvoicingService, listCanalService, createCanalService, updateCanalService, deleteCanalService
} from "../services/marketingService";
import {MarkertingPatientFilters, MarketingFilters} from "../types/dto/marketing/marketingFilters";
import {MarketingDTO} from "../types/dto/marketing/marketingDTO";


export const listCanalController  = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Marketing']
    #swagger.summary = 'List Canal Marketing '
    #swagger.description = 'List Canal Marketing by tenant'
    */
    const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    if(!tenantId) {
        throw new Error('Please, inform tenantID')
    }
    try {
        const result = await listCanalService(tenantId)
        return successResponse(res,result, 'Lista de Canais')
    } catch (error) {
        return errorResponse(res, error);
    }

}

export const createCanalController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Marketing']
    #swagger.summary = 'Create Canal Marketing '
    #swagger.description = 'Create Canal Marketing by tenant'
    */
    const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    if(!tenantId) {
        throw new Error('Please, inform tenantID')
    }
    try {
        const newCanal: MarketingDTO = req.body

        const result = await createCanalService(newCanal,tenantId)
        return successResponse(res,result, 'Canal Registrado')
    } catch (error) {
        return errorResponse(res, error);
    }

}

export const updateCanalController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Marketing']
    #swagger.summary = 'Update Canal Marketing '
    #swagger.description = 'Update Canal Marketing by tenant'
    */
    const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    if(!tenantId) {
        throw new Error('Please, inform tenantID')
    }
    try {

        const newCanal: MarketingDTO = req.body

        const result = await updateCanalService(newCanal,tenantId)
        return successResponse(res,result, 'Canal Registrado')
    } catch (error) {
        return errorResponse(res, error);
    }

}

export const deleteCanalController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Marketing']
    #swagger.summary = 'Delete Canal Marketing '
    #swagger.description = 'Delete Canal Marketing by tenant'
    */
    const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    if(!tenantId) {
        throw new Error('Please, inform tenantID')
    }

    try {
        const canalID = parseValidInt(req.params.id);
        if(!canalID) {
            return new Error('Inform ID')
        }
        const result = await deleteCanalService(canalID)
        return successResponse(res,result, )
    } catch (error) {
        return  errorResponse(res,error)
    }
}


export const countPatientExamWithFilterController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Marketing']
    #swagger.summary = 'Get Total Invoice by Exam, Date, Status  '
    #swagger.description = 'Get Total Invoice by exam name'
    */
    try {
        const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
        const {
            startDate,
            endDate,
            status,
            examID,
            examType,
            attended,
            exam_name,
            patientID,
            canal,
        } = req.query;

        const filters: MarketingFilters = {
            tenantId: tenantId!,
            startDate: startDate as string,
            endDate: endDate as string,
            status: status as 'Scheduled' | 'InProgress' | 'Completed' | undefined,
            examID: examID as string,
            examType: examType as string,
            attended: attended as string,
            exam_name: exam_name as string,
        };

        const result = await countInvoicingService(filters);
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const countPatientByMonthController = async (req: Request, res: Response) => {

        const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    const {
        startDate,
        endDate,
        gender,
        patientID,
        canal,

    } = req.query;

    const filters: MarkertingPatientFilters = {
        tenantId: tenantId!,
        startDate: startDate as string,
        endDate: endDate as string,
        patientID: patientID as string,
        canal: canal as string,
        gender: gender as string
    };
        if(!tenantId) {
            throw new Error('Tenant ID not found')
        }
    try {
        const result = await countPatientByMonthService(filters)
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);

    }
}

export const examPriceController = async (req: Request, res: Response) => {

    const tenantId = parseValidInt(req.headers['x-tenant-id'] as string);
    const {
        examID,
    } = req.query;

    const filters = {
        tenantId: tenantId!,
        examID: examID as string
    };
    if(!tenantId) {
        throw new Error('Tenant ID not found')
    }
    try {
        const result = await examPricesService(filters)
        if(!result) {
            return errorResponse(res, 'Exame não encontrado');
        }
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);

    }
}