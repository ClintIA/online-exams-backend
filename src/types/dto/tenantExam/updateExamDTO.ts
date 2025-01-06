export interface UpdateExamDTO {
    exam_name: string;
    price: number;
    doctorPrice: number;
    tenantId: number;
    exam_type?: string;
    doctors: string[]
}