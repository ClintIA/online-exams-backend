export interface CreatePatientExamDTO {
    patientId: number;
    examId: number;
    examDate: Date;
    userId: number;
    doctorId?: number;
}