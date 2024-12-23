import {patientExamsRepository} from "../repositories/patientExamsRepository";

export const countTotalPatient = async () => {

    const totalPatient = await patientExamsRepository.count({
        where: {
            status: 'Completed'
        },
        order: {examDate: 'ASC'},
    });
    return { total: totalPatient};
}
export const totalInvoicingByExam = async (filters: { status?: 'Scheduled' | 'InProgress' | 'Completed', examID?: number }) => {
    const whereCondition: any = {};
    if(filters.status) {
     whereCondition.status = filters.status
    }
    if(filters.examID) {
        whereCondition.examID = filters.examID
    }
    const totalInvoiceExam = await patientExamsRepository.count({
        where: whereCondition
    });
    return { total: totalInvoiceExam };
}