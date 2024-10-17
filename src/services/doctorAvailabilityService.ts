import {doctorAvailabilityRepository} from "../repositories/doctorAvailabilityRepository";
import {IAvailabilityRequest} from "../controllers/doctorAvailabilityController";
import { adminRepository } from "../repositories/adminRepository";
import {findDoctorById} from "./adminService";
import {findTenantById} from "./tenantService";


export const listdoctorAvailability= async (
    filters: {
        date?: Date;
        doctorId?: number;
        tenantId?: number
    }) => {

    const whereCondition: any = {};

    if (filters.tenantId) {
        whereCondition.exam = { tenant: { id: filters.tenantId } };
    }

    if (filters.date) {
        whereCondition.patient = { id: filters.date };
    }

    if (filters.doctorId) {
        whereCondition.doctor = { id : filters.doctorId }
    }

    const listAvailability = await doctorAvailabilityRepository.find({
        where: whereCondition,
        relations: ['exam.tenant'],
        order: { created_at: 'DESC' }
    });

    if(!listAvailability) {
        throw new Error('Erro ao listar disponibilidades')
    }

    return listAvailability;
};

export const createDoctorAvailability = async (availabilityData: IAvailabilityRequest, tenantId: number ) => {
    const doctor = await findDoctorById(availabilityData.doctorId);
    if(!doctor || !doctor.isDoctor) {
        throw new Error('Doutor não encontrado');
    }
    const checkDate = await doctorAvailabilityRepository.findOne({
        where: {
            date: availabilityData.date,
            tenant: { id: tenantId },
        }
    });
    const checkStartTime = await doctorAvailabilityRepository.findOne({
        where: {
            startTime: availabilityData.startTime,
            tenant: { id: tenantId },

        }
    });
    const checkDoctor = await doctorAvailabilityRepository.findOne({
        where: {
            doctor: {
                id: availabilityData.doctorId,
            },
            tenant: { id: tenantId },
        }
    });
    if(checkDate && checkStartTime && checkDoctor) {
        throw new Error("O doutor " + doctor.fullName + ", já possui um agendamento para o dia "+ availabilityData.date +", no horário de "+ availabilityData.startTime);
    }

    const tenant = await findTenantById(tenantId)
    if(!tenant) {
        throw new Error('Tenant não encontrado');
    }
    const newAvailability = { ...availabilityData, doctor: doctor, tenant: tenant, };
    const doctorAvailability = doctorAvailabilityRepository.create(newAvailability);
    const registerAvailability = await doctorAvailabilityRepository.save(doctorAvailability);
    if(registerAvailability) {
        return { message: "Disponibilidade Cadastradas" }
    } else {
        throw new Error('Não foi possivel cadastrar disponibilidade')
    }
}