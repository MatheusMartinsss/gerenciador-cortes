"use client"
import { useEffect, useState } from "react";
import {
    SetFieldValue,
    FieldValues,
    UseFormGetValues
} from "react-hook-form";

export interface FormPersistConfig {
    name: string
    storage?: Storage;
    watch: (names?: string | string[]) => any;
    setValue: SetFieldValue<any>;
    getValues: UseFormGetValues<any>
    exclude?: string[];
    onDataRestored?: (data: any) => void;
    validate?: boolean;
    dirty?: boolean;
    touch?: boolean;
    onTimeout?: () => void;
    timeout?: number;
}
type restoredDataProps = { [key: string]: any }
export const useFormPersist = ({ watch, setValue, name, getValues }: FormPersistConfig) => {
    const [restoredData, setRestoredData] = useState<restoredDataProps>({})
    const watchValues = watch()

    useEffect(() => {
        console.log(watchValues)
    }, [watchValues])

    const clearStorage = () => {
        localStorage.clear()
    }

    const restoreData = () => {
        const storage = localStorage.getItem(name)
        if (storage) {
            const { ...values } = JSON.parse(storage)
            Object.keys(values).forEach((key) => {
                const restored = Object.assign({ ...getValues(key), ...values[key] })
                setValue(key, Object.values(restored))
            })
            //setValue('tree', { ...watchValues, ...value })
        }
    }
    return {
        clearStorage,
        restoredData,
        restoreData
    }
}