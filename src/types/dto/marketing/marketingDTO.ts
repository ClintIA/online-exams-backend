export interface MarketingDTO {
    id: number;
    canal: string;
    budgetCanal?: number;
    clicks?: number;
    ctr?: number;
    cost?: number;
    costPerConversion?: number;
    conversionRate?: number;
    leads?: number;
    updatedBy: number;
}
