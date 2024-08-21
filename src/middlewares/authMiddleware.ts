import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { errorResponse } from '../utils/httpResponses';
import { AppDataSource } from '../config/database';
import { Admin } from '../models/Admin';
import { Patient } from '../models/Patient';

const adminRepository = AppDataSource.getRepository(Admin);
const patientRepository = AppDataSource.getRepository(Patient);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return errorResponse(res, new Error('Token não fornecido'), 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verifyToken(token);
        req.user = decoded;

        const { userId, isAdmin } = decoded;

        let validSession = false;

        if (isAdmin) {
            const admin = await adminRepository.findOne({ where: { id: userId } });
            if (admin && admin.sessionToken === token) {
                validSession = true;
            }
        } else {
            const patient = await patientRepository.findOne({ where: { id: userId } });
            if (patient && patient.sessionToken === token) {
                validSession = true;
            }
        }

        if (!validSession) {
            return errorResponse(res, new Error('Token inválido ou sessão expirada'), 401);
        }

        next();
    } catch (error) {
        return errorResponse(res, new Error('Token inválido'), 401);
    }
};
