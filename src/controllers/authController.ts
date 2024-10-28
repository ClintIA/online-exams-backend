import { Request, Response } from 'express';
import { registerPatient, loginPatientByCpf } from '../services/patientService'; 
import { registerAdmin, loginAdmin } from '../services/adminService';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {generatePassword} from "../utils/utils";

export const registerAdminController = async (req: Request, res: Response) => {
    try {
        const { email, adminCpf, password, fullName } = req.body;
        const tenantId = req.tenantId!;
        
        const result = await registerAdmin({ email, adminCpf, password, fullName }, tenantId);
        return successResponse(res, result, 'Admin registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const registerPatientController = async (req: Request, res: Response) => {
    try {
        const { full_name, cpf, dob, email, phone, address, gender, health_card_number } = req.body;
        const tenantId = req.tenantId!;

        const password = generatePassword({
            full_name: full_name,
            cpf: cpf,
            dob: dob,
        })

        const result = await registerPatient({
            full_name,
            password: password,
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

export const loginPatientController = async (req: Request, res: Response) => {
    try {
        const { cpf } = req.body;

        const token = await loginPatientByCpf(cpf);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

export const loginAdminController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const token = await loginAdmin(email, password);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

