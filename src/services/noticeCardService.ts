import {handleFilterDate} from "../utils/handleDate";
import {noticeCardRepository} from "../repositories/noticeCardRepository";
import {NoticeCard} from "../models/NoticeCard";
import {findTenantById} from "./tenantService";
import {findAdminById} from "./adminService";
import {ILike, Like} from "typeorm";

interface FilterParams {
    startDate?: string;
    endDate?: string;
    message?: string;
    tenantId?: number;
    createdBy?: number;
}

export const listNoticeCardService = async (filters: FilterParams): Promise<NoticeCard[]> => {
   try {
       const whereCondition: any = {};

       if (filters.tenantId) {
           whereCondition.tenant = {id: filters.tenantId};
       }

       if (filters.startDate || filters.endDate) {
           whereCondition.cardDate = handleFilterDate(filters,0)
       }

       if (filters.createdBy) {
           whereCondition.createdBy = { id: filters.createdBy};
       }
       if (filters.message) {
           whereCondition.message = ILike(`%${filters.message}%`);
       }
       return   await noticeCardRepository.find({
           select: {
               id: true,
               message: true,
               cardDate: true,
               tenant: {
                   name: true,
               },
               createdBy : {
                   fullName: true,
               }
           },
           where: whereCondition,
           relations:['createdBy'],
           order: {cardDate: 'DESC'}
       });
   } catch (error) {
       throw new Error("Erro ao listar mensagens")
   }
}

export const createCardService = async (
    cardData: { message: string; createdBy: number; date: string },
    tenantId: number
) => {
    const newCard = noticeCardRepository.create({
        message: cardData.message,
        createdBy: { id: cardData.createdBy },
        cardDate: new Date(cardData.date),
        tenant: { id: tenantId }
    });

    await noticeCardRepository.save(newCard);
    return { message: "Aviso registrado com sucesso" };
};


export const deleteCardService = async (cardId: number) => {
    try {
        const deleteResult = await noticeCardRepository.delete(cardId);

        if (deleteResult.affected === 0) {
            throw new Error('Aviso não encontrado');
        }

        return { message: "Aviso deletado com sucesso" };
    } catch (error) {
        throw new Error("Erro ao deletar aviso");
    }
};
