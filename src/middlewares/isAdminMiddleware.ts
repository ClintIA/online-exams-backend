import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/httpResponses';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role == 'patient' ||
        req.user?.role == 'doctor' ||
        req.user?.role == 'default' ||
        req.user?.role == 'marketing'
    ) {
        return errorResponse(res, new Error('Acesso negado: Apenas administradores podem realizar esta ação'), 403);
    }
    next();
};
