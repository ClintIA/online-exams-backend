import { Request, Response } from 'express';
import { registerPatient, loginStepOne, loginStepTwo } from '../services/patientService';
import { registerAdmin, loginAdmin } from '../services/adminService';
import { successResponse, errorResponse } from '../utils/httpResponses';

export const registerAdminController = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;
        const tenantId = req.tenantId!;
        
        const result = await registerAdmin({ email, password, fullName }, tenantId);
        return successResponse(res, result, 'Admin registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const registerPatientController = async (req: Request, res: Response) => {
    try {
        const { full_name, cpf, dob, email, phone, address, gender, health_card_number } = req.body;
        const tenantId = req.tenantId!;

        const result = await registerPatient({
            full_name,
            cpf,
            dob: new Date(dob),
            email,
            phone,
            address,
            gender,
            health_card_number
        }, tenantId);

        return successResponse(res, result, 'Paciente registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const loginPatientStepOneController = async (req: Request, res: Response) => {
    try {
        const { cpf } = req.body;
        const tenantId = req.tenantId!;

        const result = await loginStepOne(cpf, tenantId);
        return successResponse(res, result, 'Token de login enviado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const loginPatientStepTwoController = async (req: Request, res: Response) => {
    try {
        const { cpf, loginToken } = req.body;
        const tenantId = req.tenantId!;

        const token = await loginStepTwo(cpf, loginToken, tenantId);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

export const loginAdminController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const tenantId = req.tenantId!;

        const token = await loginAdmin(email, password, tenantId);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};
