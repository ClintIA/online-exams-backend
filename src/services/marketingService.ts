import {patientExamsRepository} from "../repositories/patientExamsRepository";
import { handleFilterDate} from "../utils/handleDate";
import {MarkertingPatientFilters, MarketingFilters} from "../types/dto/marketing/marketingFilters";
import {ILike} from "typeorm";
import {patientRepository} from "../repositories/patientRepository";
import {tenantExamsRepository} from "../repositories/tenantExamsRepository";

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
