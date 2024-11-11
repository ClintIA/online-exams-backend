export interface UpdatePatientExamDTO {
    status?: 'Scheduled' | 'InProgress' | 'Completed';
    link?: string;
}
