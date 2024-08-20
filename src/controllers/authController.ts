import { Request, Response } from 'express';
import { registerUser, registerAdmin, loginAdmin, loginPatient } from '../services/authService';
import { successResponse, errorResponse } from '../utils/httpResponses';

const handleRegistration = async (
    req: Request,
    res: Response,
    registerFunction: (email: string, tenantId: number) => Promise<{ protocol?: string, tempPassword: string }>
) => {
    try {
        const { email } = req.body;
        const tenantId = req.tenantId!;
        const registrationData = await registerFunction(email, tenantId);

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

export const registerUserController = async (req: Request, res: Response) => {
    return handleRegistration(req, res, registerUser);
};

export const registerAdminController = async (req: Request, res: Response) => {
    return handleRegistration(req, res, registerAdmin);
};

export const loginAdminController = async (req: Request, res: Response) => {
    return handleLogin(req, res, loginAdmin, 'email');
};

export const loginPatientController = async (req: Request, res: Response) => {
    return handleLogin(req, res, loginPatient, 'protocol');
};
