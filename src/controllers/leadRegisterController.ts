import { Request, Response } from 'express';
import { customErrorResponse, errorResponse, successResponse } from '../utils/httpResponses';
import {
    createLeadRegisterService,
    findAll,
    findOne,
    updateLeadService,
    softDelete,
    remove,
    search,
    CreateLeadRegisterDTO
} from '../services/leadRegisterService';

export const createLeadRegisterController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Create new Lead Register'
    #swagger.description = 'Create a new lead register for a specific tenant'
    */
    try {
        const tenantId = req.headers['x-tenant-id'];
        const leadData: CreateLeadRegisterDTO = req.body;
        console.log(leadData)
        const result = await createLeadRegisterService(leadData, parseInt(tenantId as string));
        return successResponse(res, result, 'Lead registrado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const getLeadRegistersController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'List All Lead Registers by Tenant'
    #swagger.description = 'Get All Lead Registers from a Tenant'
    */
    try {
        const tenantId = req.headers['x-tenant-id'];
        const result = await findAll(parseInt(tenantId as string));
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const getLeadRegisterByIdController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Get Lead Register by ID'
    #swagger.description = 'Get specific Lead Register by ID for a tenant'
    */
    try {
        const { id } = req.params;
        const tenantId = req.headers['x-tenant-id'];
        const result = await findOne(parseInt(id), parseInt(tenantId as string));

        if (!result) {
            return customErrorResponse(res, 'Lead não encontrado');
        }
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const updateLeadRegisterController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Update Lead Register'
    #swagger.description = 'Update Lead Register details'
    */
    try {
        const { id } = req.params;
        const tenantId = req.headers['x-tenant-id'];
        const updateData = req.body;

        const result = await updateLeadService(parseInt(id), updateData, parseInt(tenantId as string));
        return successResponse(res, result, 'Lead atualizado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const softDeleteLeadRegisterController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Soft Delete Lead Register'
    #swagger.description = 'Soft delete a Lead Register by ID'
    */
    try {
        const { id } = req.params;
        await softDelete(parseInt(id));
        return successResponse(res, null, 'Lead deletado com sucesso (soft delete)');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const deleteLeadRegisterController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Delete Lead Register'
    #swagger.description = 'Hard delete a Lead Register by ID'
    */
    try {
        const { id } = req.params;
        await remove(parseInt(id));
        return successResponse(res, null, 'Lead deletado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const searchLeadRegistersController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Lead Register']
    #swagger.summary = 'Search Lead Registers'
    #swagger.description = 'Search Lead Registers by name or phone'
    */
    try {
        const { query } = req.query;
        const result = await search(query as string);
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error);
    }
};