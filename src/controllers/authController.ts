import { Request, Response } from 'express';
import { registerPatient, registerAdmin, loginAdmin, loginPatient } from '../services/authService';
import { successResponse, errorResponse } from '../utils/httpResponses';

const handlePatientRegistration = async (
    req: Request,
    res: Response,
    registerFunction: (patientData: {
        full_name: string;
        cpf: string;
        dob: Date;
        email: string;
        phone: string;
        address: string;
        gender?: string;
        health_card_number?: string;
    }, tenantId: number) => Promise<{ protocol: string, tempPassword: string }>
) => {
    try {
        const { full_name, cpf, dob, email, phone, address, gender, health_card_number } = req.body;
        const tenantId = req.tenantId!;

        const registrationData = await registerFunction({
            full_name,
            cpf,
            dob: new Date(dob),
            email,
            phone,
            address,
            gender,
            health_card_number
        }, tenantId);

        return successResponse(res, registrationData, 'Registration successful', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};


const handleLogin = async (
    req: Request,
    res: Response,
    loginFunction: (identifier: string, password: string, tenantId: number) => Promise<string>,
    identifierKey: 'email' | 'protocol'
) => {
    try {
        const identifier = req.body[identifierKey];
        const { password } = req.body;
        const tenantId = req.tenantId!;
        const token = await loginFunction(identifier, password, tenantId);

        return successResponse(res, { token }, 'Login successful');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

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
    return handlePatientRegistration(req, res, registerPatient);
};

export const loginAdminController = async (req: Request, res: Response) => {
    return handleLogin(req, res, loginAdmin, 'email');
};

export const loginPatientController = async (req: Request, res: Response) => {
    return handleLogin(req, res, loginPatient, 'protocol');
};
