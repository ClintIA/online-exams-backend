import {patientExamsRepository} from "../repositories/patientExamsRepository";
import { handleFilterDate} from "../utils/handleDate";
import {MarkertingPatientFilters, MarketingFilters} from "../types/dto/marketing/marketingFilters";
import {ILike} from "typeorm";
import {patientRepository} from "../repositories/patientRepository";
import {tenantExamsRepository} from "../repositories/tenantExamsRepository";
import {marketingRepository} from "../repositories/marketingRepository";
import {MarketingDTO} from "../types/dto/marketing/marketingDTO";

export const listCanalService = async (tenantID: number) => {
    return await marketingRepository.find({
        where: {
            tenant: { id: tenantID }
        }
    })
}

export const createCanalService = async (newCanal: MarketingDTO, tenantID: number) => {
    try {
         await marketingRepository.save({
             canal: newCanal.canal,
             budgetCanal: newCanal.budgetCanal,
             createdBy: { id: newCanal.createdBy },
             updatedBy: { id: newCanal.uploadBy },
             tenant: { id: tenantID }
         })

        return { message: 'Canal Registrado com sucesso' }
    } catch (error) {
        return new Error('Erro ao cadastrar canal')
    }
}
export const updateCanalService = async (newCanal: MarketingDTO, tenantID: number) => {
    try {
        await marketingRepository.save({
            id: newCanal.id,
            canal: newCanal.canal,
            budgetCanal: newCanal.budgetCanal,
            updatedBy: { id: newCanal.uploadBy },
            tenant: { id: tenantID}
        })

        return { message: 'Canal Atualizado com sucesso' }
    } catch (error) {
        return new Error('Erro ao atualizar canal')
    }
}
export const deleteCanalService = async (canalID: number) => {
    try {
        await marketingRepository.delete({
          id: canalID
        })

        return { message: 'Canal deletado com sucesso' }
    } catch (error) {
        return new Error('Erro ao deletar canal')
    }
}
export const countInvoicingService = async (filters: MarketingFilters) => {
    const whereCondition: any = {};

    if(filters.status) {
     whereCondition.status = filters.status
    }
    if(filters.examID) {
        whereCondition.exam = { id: parseInt(filters.examID) }
    }
    if (filters.startDate || filters.endDate) {
        whereCondition.examDate = handleFilterDate(filters, 1);
    }
    if(filters.tenantId) {
        whereCondition.tenant = { id: filters.tenantId}
    }
    if(filters.examType) {
        whereCondition.exam = { exam_type: filters.examType }
    }
    if(filters.attended) {
        whereCondition.attended = filters.attended
    }
    if(filters.exam_name) {
        whereCondition.exam = { exam_name: ILike(`%${filters.exam_name}%`) }
    }

    const totalExams = await patientExamsRepository.count({
        where : whereCondition
    });

    return { total: totalExams };
}

export const countPatientByMonthService = async (filters: MarkertingPatientFilters) => {
    const whereCondition: any = {};
    if(filters.tenantId) {
        whereCondition.tenants = { id: filters.tenantId }
    }
    if (filters.startDate || filters.endDate) {
        whereCondition.examDate = handleFilterDate(filters, 1);
    }
    if(filters.patientID) {
        whereCondition.id = parseInt(filters.patientID)
    }
    if(filters.gender) {
        whereCondition.gender = filters.gender
    }
    if(filters.canal) {
        whereCondition.canal =  parseInt(filters.canal)
    }

    const totalExamType = await patientRepository.count({
            where: whereCondition
    })
    return { total: totalExamType }
}
export const examPricesService = async (filters: MarketingFilters) => {
    const whereCondition: any = {};

    if(filters.tenantId) {
        whereCondition.tenant = { id: filters.tenantId }
    }
    if(filters.examID) {
        whereCondition.id = filters.examID
    }

    const priceExam = await tenantExamsRepository.findOne({
        where: whereCondition
    })
    return { price: priceExam?.price }
}
