import {Between} from "typeorm";

export const getFormattedDate = (date: string, offsetDays: number = 0): string => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + offsetDays);
    return dateObj.toISOString().split('T')[0];
};

export const handleFilterDate = (filters: { startDate?: string, endDate?: string}) => {
    const whereCondition: any = {}
    console.log(filters)
    if (filters.startDate && filters.endDate) {
        return whereCondition.examDate = Between(filters.startDate, getFormattedDate(filters.endDate, 1)
        );
    } else if (filters.startDate) {
        return whereCondition.examDate = Between(
            filters.startDate,
            getFormattedDate(filters.startDate, 1)
        );
    } else if (filters.endDate) {
       return  whereCondition.examDate = Between(
            filters.endDate,
           getFormattedDate(filters.endDate, 1)
        );
    }
}