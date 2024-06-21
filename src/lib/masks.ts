import { format } from 'date-fns';

export const maskToM3 = (value: number) => {
    return `${(value / 1000).toFixed(3)}`
}

export const maskToMeters = (value: number) => {
    return `${(value / 100).toFixed(2)}`
}

export const unMask = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return (Number(onlyNumbers))
}

export const normalizeString = (str: string): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const dateMask = (date: Date) => {
    if (date) {
        return format(new Date(date), 'dd/MM/yyyy')
    }
    return 'N/A '
}

