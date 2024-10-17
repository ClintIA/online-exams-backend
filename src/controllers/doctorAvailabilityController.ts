import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/httpResponses';
import {createDoctorAvailability, listdoctorAvailabilityService} from "../services/doctorAvailabilityService";

export interface IAvailabilityRequest {
    doctorId: number
    availabilityDate: Date
    startTime: string
    endTime: string
}

export const listDoctorAvailability = async (req: Request, res: Response) => {
    const tenantId = req.headers['x-tenant-id'];
    const { availabilityDate, doctorId } = req.query;
    if (!tenantId) {
        return errorResponse(res, new Error('É necessário passar o tenantId'), 400);
    }


    const filters = {
        availabilityDate: availabilityDate ? availabilityDate as string : undefined,
        doctorId: doctorId ? parseInt(doctorId as string) : undefined,
        tenantId: tenantId? parseInt(tenantId as string) : undefined,
    }
    try {
        const result = await listdoctorAvailabilityService(filters);
        return successResponse(res, result, 'Lista de disponibilidades');

    } catch (error) {
        return errorResponse(res, error);

    }
}

export const createNewAvailability = async (req: Request, res: Response) => {

    const doctorId = req.body.doctorId;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const availabilityDate = req.body.date;

    if (!doctorId || !startTime || !endTime || !availabilityDate) {
        return errorResponse(res, new Error('Dados inválidos'), 400);
    }

    const availability: IAvailabilityRequest = {
        doctorId: doctorId,
        availabilityDate: new Date(availabilityDate),
        startTime: startTime,
        endTime: endTime,
    }

    const tenantId = req.tenantId
    if (!tenantId) {
        return errorResponse(res, new Error('É necessário passar o tenantId'), 400);
    }
    try {
        const result = await createDoctorAvailability(availability,tenantId)
        return successResponse(res, result);

    } catch (error) {
        return errorResponse(res, error);

    }

}
export const createListAvailability = async (req: Request, res: Response) => {
    const listAvailability  = req.body.availability;
    console.log(listAvailability);
    const tenantId = req.tenantId
    if (!tenantId) {
        return errorResponse(res, new Error('É necessário passar o tenantID'), 400);
    }
    for ( let availability of listAvailability) {
        try {
            const result = await createDoctorAvailability(availability,tenantId)
        } catch (error) {
            return errorResponse(res, error);
        }
    }
    successResponse(res, 'Lista de disponibilidades registrada');
}