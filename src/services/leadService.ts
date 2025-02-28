import {IsNull, Like} from 'typeorm';
import { leadRepository } from '../repositories/leadRepository';
import { tenantExamsRepository } from '../repositories/tenantExamsRepository';
import { doctorRepository } from '../repositories/doctorRepository';
import { tenantRepository } from '../repositories/tenantRepository';
import { CreateLeadDTO } from '../types/dto/lead/CreateLeadDTO';
import { UpdateLeadDTO } from '../types/dto/lead/UpdateLeadDTO';
import { DeleteLeadDTO } from '../types/dto/lead/DeleteLeadDTO';
import { ListLeadsDTO } from '../types/dto/lead/ListLeadsDTO';

export const listLeads = async (filters?: ListLeadsDTO) => {
    const whereCondition: any = {};

    whereCondition.delete_at = IsNull();

    if (filters?.tenantId) {
        whereCondition.tenant = { id: filters.tenantId };
    }
    if (filters?.name) {
        whereCondition.name = Like(`%${filters.name}%`);
    }
    if (filters?.phoneNumber) {
        whereCondition.phoneNumber = filters.phoneNumber;
    }
    if (filters?.scheduled !== undefined) {
        whereCondition.scheduled = filters.scheduled;
    }
    if (filters?.doctorId) {
        whereCondition.scheduledDoctor = { id: filters.doctorId };
    }
    if (filters?.examId) {
        whereCondition.exam = { id: filters.examId };
    }

    const [leads, total] = await leadRepository.findAndCount({
        where: whereCondition,
        take: filters?.take,
        skip: filters?.skip,
        relations: ['exam', 'scheduledDoctor', 'tenant'],
        order: { callDate: 'DESC' },
    });
    return { leads, total };
};

export const createLead = async (leadData: CreateLeadDTO, tenantId: number) => {
    let exam;
    let scheduledDoctor;

    if (leadData.examId) {
        exam = await tenantExamsRepository.findOne({ where: { id: leadData.examId } });
    }
    if (leadData.scheduledDoctorId) {
        scheduledDoctor = await doctorRepository.findOne({ where: { id: leadData.scheduledDoctorId } });
    }
    const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) {
        throw new Error('Tenant inválido');
    }

    const newLead = leadRepository.create({
        ...leadData,
        exam,
        scheduledDoctor,
        tenant
    });

    const result = await leadRepository.save(newLead);
    return { message: 'Lead criado com sucesso', data: result };
};

export const updateLead = async (leadId: number, leadData: UpdateLeadDTO) => {
    const updateResult = await leadRepository.update({ id: leadId }, leadData);

    if (!updateResult.affected) {
        throw new Error('Erro ao atualizar o lead ou lead não encontrado');
    }
    const updatedLead = await leadRepository.findOne({ where: { id: leadId } });
    return { message: 'Lead atualizado com sucesso', data: updatedLead };
};

export const deleteLead = async ({ leadId, tenantId }: DeleteLeadDTO) => {
    const updateResult = await leadRepository.update(
        { id: leadId, tenant: { id: tenantId } },
        { delete_at: new Date() }
    );

    if (!updateResult.affected) {
        throw new Error('Lead não encontrado');
    }
    return { message: 'Lead deletado (soft delete) com sucesso' };
};
