import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/httpResponses';
import { requestPasswordReset, validateResetToken, resetPassword } from '../services/resetPasswordService';
import { RequestPasswordResetDTO } from '../types/dto/resetPassword/RequestPasswordResetDTO';
import { ValidateResetTokenDTO } from '../types/dto/resetPassword/ValidateResetTokenDTO';
import { ResetPasswordDTO } from '../types/dto/resetPassword/ResetPasswordDTO';

export const requestPasswordResetController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Auth']
     #swagger.summary = 'Request Password Reset'
     #swagger.description = 'Sends a reset token to the user\'s WhatsApp.'
    */
    try {
        const data: RequestPasswordResetDTO = req.body;

        if (!data.identifier) {
            return errorResponse(res, new Error('O identificador (email ou CPF) é obrigatório.'), 400);
        }

        const result = await requestPasswordReset(data);

        return successResponse(res, result, 'Token enviado com sucesso.');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const validateResetTokenController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Auth']
     #swagger.summary = 'Validate Reset Token'
     #swagger.description = 'Validates if the provided reset token is valid.'
    */
    try {
        const data: ValidateResetTokenDTO = req.body;

        if (!data.identifier || !data.token) {
            return errorResponse(res, new Error('O identificador e o token são obrigatórios.'), 400);
        }

        const result = await validateResetToken(data);

        return successResponse(res, result, 'Token válido.');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const resetPasswordController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Auth']
     #swagger.summary = 'Reset Password'
     #swagger.description = 'Resets the user\'s password using a valid token.'
    */
    try {
        const data: ResetPasswordDTO = req.body;

        if (!data.identifier || !data.token || !data.newPassword) {
            return errorResponse(res, new Error('O identificador, token e nova senha são obrigatórios.'), 400);
        }

        const result = await resetPassword(data);

        return successResponse(res, result, 'Senha redefinida com sucesso.');
    } catch (error) {
        return errorResponse(res, error);
    }
};
