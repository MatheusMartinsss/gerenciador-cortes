export const formatSearchParam = (param: string) => {

    if (typeof param === 'string' && param.trim() !== "") {
        if (param.includes(',')) {
            const regex = /^(\s*\d+\s*,)*\s*\d+\s*$/;

            if (regex.test(param)) {
                const parts = param.split(',').map(part => part.trim())

                const numberArray = parts.map(Number).filter(num => !isNaN(num))

                return {
                    type: 'numberArray',
                    value: numberArray
                }
            }
        }
        const numericSearchParam = Number(param);
        const isNumeric = !isNaN(numericSearchParam);
        if (isNumeric) {
            return {
                type: 'numeric',
                value: numericSearchParam
            }
        }
        return {
            type: 'string',
            value: param
        }
    }

}