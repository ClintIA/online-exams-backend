import {Request, Response} from "express";
import {generatePasswordByCpfAndName} from "../utils/passwordGenerator";
import {errorResponse, successResponse} from "../utils/httpResponses";
import {RegisterDoctorDTO} from "../types/dto/doctor/registerDoctorDTO";
import {addDoctorToExam} from "../services/tenantExamService";
import {registerDoctor, updateDoctorService, deleteDoctorService} from "../services/doctorService";

export const registerDoctorController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Doctor']
    #swagger.summary = 'Register a Doctor'
    #swagger.description = 'Route to create a new doctor'
    */
    try {
        const newDoctor: RegisterDoctorDTO = req.body.newDoctor;
        const tenantId = req.tenantId!;
        const exams: string[] = req.body.exams;

        const password = generatePasswordByCpfAndName(newDoctor.cpf, newDoctor.fullName);

        const result = await registerDoctor(
            { ...newDoctor, password},
            tenantId
        );
        if(exams) {
            await addDoctorToExam(exams, result.data)
        }

        // await sendLoginInfoToAdmin({
        //     name: newDoctor.fullName,
        //     phoneNumber: newDoctor.phone || "",
        //     login: newDoctor.cpf,
        //     password: password,
        //     tenantId: tenantId
        // });

        return successResponse(res, result, 'Médico registrado com sucesso', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

export const updateDoctorController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Doctor']
    #swagger.summary = 'Update Doctor'
    #swagger.description = 'Update doctor details such as CRM, CNPL, CEP, full name, and CPF'
    */
    try {
        const doctorID = parseInt(req.params.id);
        const { CRM, fullName, cpf, cep, phone, CNPJ, occupation } = req.body;

        const result = await updateDoctorService(doctorID, { CRM, fullName, cpf, cep, phone, CNPJ, occupation });
        return successResponse(res, result, 'Médico atualizado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};


export const deleteDoctorController = async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Doctor']
    #swagger.summary = 'Delete Doctor'
    #swagger.description = 'Delete an doctor from the database by Doctor ID - can not be '
    */
    try {
        const doctorId = parseInt(req.params.id);

        await deleteDoctorService(doctorId);
        return successResponse(res, null, 'Médico deletado com sucesso');
    } catch (error) {
        return errorResponse(res, error);
    }
};