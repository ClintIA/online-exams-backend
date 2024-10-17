import {doctorAvailabilityRepository} from "../repositories/doctorAvailabilityRepository";
import {IAvailabilityRequest} from "../controllers/doctorAvailabilityController";
import {findDoctorById} from "./adminService";
import {findTenantById} from "./tenantService";

export const listdoctorAvailabilityService = async (
    filters: {
        availabilityDate?: string;
        doctorId?: number;
        tenantId?: number
    }) => {

    const whereCondition: any = {};

    if (filters.doctorId) {
        const doctor = await findDoctorById(filters.doctorId);
        if(!doctor || !doctor.isDoctor) {
            throw new Error('Doutor não encontrado');
        }
        whereCondition.doctor = { id: filters.doctorId  }
    }
    if (filters.tenantId) {
        whereCondition.tenant = { id: filters.tenantId  }
    }

    if (filters.availabilityDate) {
        whereCondition.availabilityDate =  filters.availabilityDate ;
    }
    console.log(whereCondition);
    const listAvailability = await doctorAvailabilityRepository.find({
        where: whereCondition,
        relations: ['doctor','tenant'],
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
            availabilityDate: availabilityData.availabilityDate,
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
        throw new Error("O doutor " + doctor.fullName + ", já possui um agendamento para o dia "+ availabilityData.availabilityDate +", no horário de "+ availabilityData.startTime);
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