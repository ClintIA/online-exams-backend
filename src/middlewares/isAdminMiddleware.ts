import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/httpResponses';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        return errorResponse(res, new Error('Acesso negado: Apenas administradores podem realizar esta ação'), 403);
    }
    next();
};
