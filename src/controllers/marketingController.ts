import {Request, Response} from "express";
import {errorResponse, successResponse} from "../utils/httpResponses";
import {parseValidInt} from "../utils/parseValidInt";
import {
    countPatientByMonthService,
    examPricesService,
    countInvoicingService
} from "../services/marketingService";
import {MarkertingPatientFilters, MarketingFilters} from "../types/dto/marketing/marketingFilters";

export const getTotalInvoiceWithFiltersController = async (req: Request, res: Response) => {
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