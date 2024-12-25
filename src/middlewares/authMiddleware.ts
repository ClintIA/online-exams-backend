import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../utils/jwtHelper';
import {errorResponse} from '../utils/httpResponses';
import {adminRepository} from '../repositories/adminRepository';
import {patientRepository} from '../repositories/patientRepository';
import {doctorRepository} from "../repositories/doctorRepository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return errorResponse(res, new Error('Token não fornecido'), 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verifyToken(token);
        req.user = decoded;

        const { userId, role } = decoded;

        let validSession = false;
        switch (role) {
            case 'patient':
                const patient = await patientRepository.findOne({ where: { id: userId } });
                if (patient && patient.sessionToken === token) {
                    validSession = true;
                }
                break;
            case 'doctor':
                const doctor = await doctorRepository.findOne({ where: { id: userId } });
                if (doctor && doctor.sessionToken === token) {
                    validSession = true;
                }
                break
            default:
                const admin = await adminRepository.findOne({ where: { id: userId } });
                if (admin && admin.sessionToken === token) {
                    validSession = true;
                }
                break;
        }

        if (!validSession) {
            return errorResponse(res, new Error('Token inválido ou sessão expirada'), 401);
        }

        next();
    } catch (error) {
        return errorResponse(res, new Error('Token inválido'), 401);
    }
};
