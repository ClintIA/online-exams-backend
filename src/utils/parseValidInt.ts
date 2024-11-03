export const parseValidInt = (value: any): number | null => {
    const parsedInt = parseInt(value, 10);
    return isNaN(parsedInt) ? null : parsedInt;
};