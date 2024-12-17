import { Request, Response } from 'express';
import { registerPatient, loginPatientByCpf } from '../services/patientService'; 
import { registerAdmin, loginAdmin } from '../services/adminService';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {generatePassword, generatePasswordByCpfAndName} from "../utils/passwordGenerator";
import { sendLoginInfoToAdmin, sendLoginInfoToClient } from './notificationController';
import { RegisterPatientDTO } from '../types/dto/auth/registerPatientDTO';
import { LoginAdminDTO } from '../types/dto/auth/loginAdminDTO';
import { RegisterAdminDTO } from '../types/dto/auth/registerAdminDTO';
import { LoginPatientDTO } from '../types/dto/auth/loginPatientDTO';
import {addDoctorToExam} from "../services/tenantExamService";

export const registerAdminController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Admin']
    #swagger.summary = 'Register a Admin'
    #swagger.description = 'Route to create a new admin/doctor'
    */
    try {
        const newAdmin: RegisterAdminDTO = req.body.adminData;
        const exams: string[] = req.body.exams;
        const tenantId = req.tenantId!;

        const password = generatePasswordByCpfAndName(newAdmin.cpf, newAdmin.fullName);

        const result = await registerAdmin(
            { ...newAdmin, password, isDoctor: newAdmin.isDoctor ?? false },
            tenantId
        );

        if(exams) {
            const addDoctor = await addDoctorToExam(exams, result.data)
            if(!addDoctor) {
                 new Error('Erro ao Cadastrar Médico')
            }
        }
        // await sendLoginInfoToAdmin({
        //     name: adminData.fullName,
        //     phoneNumber: adminData.phone || "",
        //     login: adminData.adminCpf,
        //     password: password,
        //     tenantId: tenantId
        // });

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
        const patientData: RegisterPatientDTO = req.body;
        const tenantId = req.tenantId!;

        const password = generatePassword({
            full_name: patientData.full_name,
            dob: patientData.dob,
        });

        const result = await registerPatient(
            { ...patientData, password },
            tenantId
        );

        // await sendLoginInfoToClient({
        //     name: patientData.full_name,
        //     phoneNumber: patientData.phone,
        //     login: patientData.cpf,
        //     password: password,
        //     tenantId: tenantId
        // });

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
        const loginData: LoginPatientDTO = req.body;

        const token = await loginPatientByCpf(loginData);
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
        const loginData: LoginAdminDTO = req.body;

        const token = await loginAdmin(loginData);
        return successResponse(res, { token }, 'Login realizado com sucesso');
    } catch (error) {
        return errorResponse(res, error, 401);
    }
};

export const forgetPasswordController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Forget Password'
    #swagger.description = 'Route to recover password'
    */
    try {
        const { email } = req.body;
        // const tenantId = req.tenantId!;

        // const result = await forgetPassword(email, tenantId);

        return successResponse(res, 'Email enviado com sucesso');
    }
    catch (error) {
        return errorResponse(res, error);
    }
};