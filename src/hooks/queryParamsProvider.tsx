import React, { createContext, useContext, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface QueryParamsContextProps {
    getParam: (key: string, defaultValue: any) => any;
    setParam: (key: string, value: any) => void;
}

const QueryParamsContext = createContext<QueryParamsContextProps | undefined>(undefined);

export const QueryParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParams = new URLSearchParams(searchParams);

    const getParam = (key: string, defaultValue: any) => {
        const param = queryParams.get(key);
        return param !== null ? param : defaultValue;
    };
    const setParam = (key: string, value: any) => {
        if (value === null || value === undefined || value === "") {
            queryParams.delete(key);
        } else {
            queryParams.set(key, String(value));
        }

        router.push(`?${queryParams.toString()}`);
    };
    const clearParams = (keys?: string[]) => {
        if (keys && keys.length > 0) {
            keys.forEach((key) => queryParams.delete(key));
        } else {
            queryParams.forEach((_, key) => queryParams.delete(key));
        }

        router.push(`?${queryParams.toString()}`);
    };


    const value = useMemo(() => ({ getParam, setParam, clearParams }), [searchParams]);

    return (
        <QueryParamsContext.Provider value={value}>
            {children}
        </QueryParamsContext.Provider>
    );
};
export const useQueryParams = () => {
    const context = useContext(QueryParamsContext);
    if (!context) {
        throw new Error("useQueryParams deve ser usado dentro de um QueryParamsProvider");
    }
    return context;
};