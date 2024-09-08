export function removeNulls(params: Record<string, any>) {
    const result: Record<string, any> = {};

    Object.keys(params).forEach((key) => {
        const val = params[key];

        if (val !== undefined && val !== null && val !== '') {
            result[key] = val;
        }
    });

    return result;
}