export interface MarketingFilters {
    tenantId?: number;
    startDate?: string
    endDate?: string
    status?: 'Scheduled' | 'InProgress' | 'Completed'
    examID?: string
    examType?: string
    attended?: string
    exam_name?: string
    channel?: string
    patientID?: string
    canal?: string
    gender?: string
    doctorID?: string
}

