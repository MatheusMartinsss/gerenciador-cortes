
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




