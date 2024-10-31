import {handleFilterDate} from "../utils/handleDate";
import {noticeCardRepository} from "../repositories/noticeCardRepository";
import {NoticeCard} from "../models/NoticeCard";
import {findTenantById} from "./tenantService";
import {findAdminById} from "./adminService";
import {tenantExamsRepository} from "../repositories/tenantExamsRepository";

interface FilterParams {
    startDate?: string;
    endDate?: string;
    tenantId?: number;
    userId?: string
}
export const listNoticeCards = async (filters: FilterParams): Promise<NoticeCard[]> => {
    const whereCondition: any = {};

        if (filters.tenantId) {
            whereCondition.tenant =  { id: filters.tenantId};
        }

        if (filters.startDate && filters.endDate) {
            whereCondition.examDate = handleFilterDate(filters)
        }
        if (filters.userId) {
            whereCondition.createdBy = { id: filters.userId};
        }
        return await noticeCardRepository.find({
            where: whereCondition,
            relations: ['patient', 'exam', 'exam.tenant'],
            order: {created_at: 'DESC'}
        });
}

export const createCard = async (cardData: { message: string, createdBy: number, cardDate: string },tenantId: number) => {
    const tenant = await findTenantById(tenantId);
    const admin = await findAdminById(cardData.createdBy)
    if(tenant && admin) {
            const newCardData = {...cardData, createdBy: admin, date: new Date(cardData.cardDate),tenant: tenant}
            const newCard = noticeCardRepository.create(newCardData)
            await noticeCardRepository.save(newCard)
            return  { message: "Aviso Registrado com sucesso" };
    } else {
        return { message:"Tenant ou Admin não encontrado"}
    }
}

export const deleteCard = async (cardId: number, tenantId: number) => {
    await noticeCardRepository.delete(cardId);
    return { message: "Aviso Deletado com sucesso" };
}