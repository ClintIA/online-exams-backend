export interface ListPatientExamsDTO {
    patientCpf?: string;
    startDate?: string;
    endDate?: string;
    status?: 'Scheduled' | 'InProgress' | 'Completed';
    patientName?: string;
    patientId?: number;
    tenantId?: number;
    take?: number;
    skip?: number;
    doctorID?: number;
    exam_name?: string;
    attended?: string
}