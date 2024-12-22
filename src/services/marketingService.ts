
import {handleFilterDate} from "../utils/handleDate";
import {patientExamsRepository} from "../repositories/patientExamsRepository";

export const countTotalPatient = async () => {

    const [exams, total] = await patientExamsRepository.findAndCount({
        where: {
            status: 'Completed'
        },
        relations: ['patient', 'exam', 'exam.tenant', 'doctor'],
        order: {examDate: 'ASC'},
    });
    return {exams, total};
}
export const totalInvoicingByExam = async (examId: number) => {

    const totalInvoiceExam = await patientExamsRepository.count({
        where: {
            status: 'Completed',
            exam: {
                id: examId
            }
        },
        relations: ['patient', 'exam', 'exam.tenant', 'doctor'],
        order: {examDate: 'ASC'},
    });
    return { totalInvoiceExam };
}