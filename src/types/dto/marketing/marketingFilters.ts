export interface MarketingFilters {
    tenantId?: number;
    startDate?: string
    endDate?: string
    status?: 'Scheduled' | 'InProgress' | 'Completed'
    examID?: string
    examType?: string
    attended?: string
    exam_name?: string
}

export interface MarkertingPatientFilters {
    startDate?: string
    endDate?: string
    tenantId?: number
    patientID?: string
    canal?: string
    gender?: string

}