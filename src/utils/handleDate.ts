import {Between} from "typeorm";

export const getFormattedDate = (date: string, offsetDays: number = 0): string => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + offsetDays);
    return dateObj.toISOString().split('T')[0];
};

export const handleFilterDate = (filters: { startDate?: string, endDate?: string}, offset?: number) => {
    if (filters.startDate && filters.endDate) {
        return Between(filters.startDate, getFormattedDate(filters.endDate, offset)
        );
    } else if (filters.startDate) {
        return Between(
            filters.startDate,
            getFormattedDate(filters.startDate, offset)
        );
    } else if (filters.endDate) {
       return Between(
            filters.endDate,
           getFormattedDate(filters.endDate, offset)
        );
    }
}