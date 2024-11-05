import { Request, Response } from 'express';
import {successResponse, errorResponse, customErrorResponse} from '../utils/httpResponses';
import {createCardService, deleteCardService, listNoticeCardService} from "../services/noticeCardService";

export const listNoticeCardController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'List Notices Cards  '
    #swagger.description = 'Route to list all notice card or with filters'
    */
    try {
        const tenantId = req.tenantId;
        const {
            message,
            createdBy,
            startDate,
            endDate,
        } = req.query;

        if (!tenantId) {
            return errorResponse(res, new Error('É necessário passar o tenantId'), 400);
        }

        const filters = {
            startDate: startDate ? startDate as string : undefined,
            endDate: endDate ? endDate as string : undefined,
            message: message ? message as string : undefined,
            createdBy: createdBy ? parseInt(createdBy as string) : undefined,
            tenantId: tenantId ? tenantId : undefined,
        };
        const messageCards = await listNoticeCardService(filters)
        return successResponse(res, messageCards, 'Lista de mensagens para o Mural de avisos');
    } catch (error) {
        return errorResponse(res,error)
    }
}

export const createCardController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Create a Notice Card  '
    #swagger.description = 'Route to create a notice card'
    */
    try {
        const { message, createdBy, date } = req.body;
        const tenantId = req.tenantId;
        if(!message || !createdBy || !date || !tenantId) {
            return customErrorResponse(res, 'Dados incompletos')
        }
        const newCard = {
            message: message as string,
            createdBy: createdBy as number,
            date: date as string,
        }
       const result = await createCardService(newCard, tenantId)
        return successResponse(res, result, "Aviso Registrado com sucesso");
    } catch (error) {
        return errorResponse(res,error)
    }
}

export const deleteCardController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Delete a Notice Card  '
    #swagger.description = 'Route to delete a notice card'
    */
   try {
       const {cardId} = req.params;

       if(!cardId) {
           return errorResponse(res,"Dados incompletos", 400)
       }
       const result = await deleteCardService(parseInt(cardId as string))
       if(!result) {
           return customErrorResponse(res, 'Erro ao deletar aviso')
       }
       return successResponse(res, result, "Aviso Deletado")
   } catch (error) {
       return errorResponse(res, error);
   }

}