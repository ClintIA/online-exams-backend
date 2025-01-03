import { addDays, format } from 'date-fns';

export const getFormattedDate = (date: string, offsetDays: number = 0): string => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + offsetDays);
    return dateObj.toISOString().split('T')[0];
};

export const handleFilterDate = (filters: { startDate?: string; endDate?: string }, offset?: number) => {
    const result: { gte?: Date; lte?: Date } = {};

    const formatDate = (date: string) => {
        return format(addDays(new Date(date), offset || 0), 'yyyy-MM-dd');
    };

    if (filters.startDate) {
        result.gte = new Date(formatDate(filters.startDate));
    }

    if (filters.endDate) {
        result.lte = new Date(formatDate(filters.endDate));
    }

    return result;
};