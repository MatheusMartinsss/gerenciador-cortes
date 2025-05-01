import { format } from 'date-fns';

export const maskToM3 = (value: number) => {
    if (!value) return ""
    return `${(value / 1000).toFixed(3)} m³`
}

export const formatVolumeM3 = (value: number | undefined): string => {
    if (typeof value !== "number" || isNaN(value)) return ""
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    }) + " m³"
}
export const formatM3WithSuffix = (value: number | string) => {
    const float = typeof value === "number" ? value : parseFloat(value || "0")
    if (isNaN(float)) return ""
    return float.toFixed(2).replace(".", ",") + " m³"
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

