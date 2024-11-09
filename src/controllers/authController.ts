import { Request, Response } from 'express';
import { registerPatient, loginPatientByCpf } from '../services/patientService'; 
import { registerAdmin, loginAdmin } from '../services/adminService';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {generatePassword, generatePasswordByCpfAndName} from "../utils/passwordGenerator";
import { sendLoginInfoToAdmin, sendLoginInfoToClient } from './notificationController';

export const registerAdminController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Register a Admin'
    #swagger.description = 'Route to create a new admin/doctor'
    */
    try {
        const { email, adminCpf, fullName, CRM, phone, isDoctor } = req.body;
        const tenantId = req.tenantId!;

        const password = generatePasswordByCpfAndName(adminCpf, fullName);

        const result = await registerAdmin({
            email,
            adminCpf,
            password,
            fullName,
            CRM,
            phone,
            isDoctor: isDoctor || false
        }, tenantId);

        await sendLoginInfoToAdmin({
            name: fullName,
            phoneNumber: phone,
            login: adminCpf,
            password: password,
            tenantId: tenantId
        });

        return successResponse(res, result, 'Admin registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const registerPatientController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Register a Patient '
    #swagger.description = 'Route to create a new patient and send notification'
    */
    try {
        const { full_name, cpf, dob, email, phone, address, canal, gender, health_card_number } = req.body;
        const tenantId = req.tenantId!;

        const password = generatePassword({
            full_name: full_name,
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
            canal,
            gender,
            health_card_number
        }, tenantId);

        await sendLoginInfoToClient({
            name: full_name,
            phoneNumber: phone,
            login: cpf,
            password: password,
            tenantId: tenantId
        });

        return successResponse(res, result, 'Paciente registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const loginPatientController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Auth']
     #swagger.summary = 'Login as patient'
     #swagger.description = 'Route to Login as patient'
     */
    try {
        const { cpf, password } = req.body;

        const token = await loginPatientByCpf(cpf,password);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

export const loginAdminController = async (req: Request, res: Response) => {
    /*
     #swagger.tags = ['Auth']
     #swagger.summary = 'Login as Admin'
     #swagger.description = 'Route to Login as admin'
     */
    try {
        const { email, password } = req.body;

        const token = await loginAdmin(email, password);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

