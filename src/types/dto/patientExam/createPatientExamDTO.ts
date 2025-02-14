import {RegisterPatientDTO} from "../auth/registerPatientDTO";

export interface CreatePatientExamDTO {
    patientId: number;
    examId: number;
    examDate: Date;
    userId: number;
    doctorId?: number;
}
export interface CreatePatientExamWithPatientDTO {
    patientData: RegisterPatientDTO;
    examId: number;
    examDate: Date;
    userId: number;
    doctorId: number;
}