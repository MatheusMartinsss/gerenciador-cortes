import { useSearchParams, useRouter } from "next/navigation";
import { useQueryParams } from "../hooks/queryParamsProvider";
import { useCallback } from "react";

export const useParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);

  let optionsSelected = 0;
  const maxOptionsSelect = 3;

  const updateSearchParams = (key: string, value: string) => {
    if (value === "") {
      queryParams.delete(key);
    } else {
      queryParams.set(key, value);
    }
    router.push(`?${queryParams.toString()}`);
  };

  const handleSort = () => {
    if (optionsSelected >= maxOptionsSelect) {
      queryParams.delete("sortOrder");
      queryParams.delete("orderBy");
    } else {
      const currentOrder = queryParams.get("sortOrder") || "ASC";
      queryParams.set("sortOrder", currentOrder === "DESC" ? "DESC" : "ASC");
      optionsSelected++;
    }
    router.push(`?${queryParams.toString()}`);
  };

  const handleFromDate = (value: string) => {
    updateSearchParams("from", value);
  };

  const handleEndDate = (value: string) => {
    updateSearchParams("end", value);
  };

  const handleSearchParam = (value: string) => {
    updateSearchParams("searchParam", value);
  };

  const handleOrderBy = (value: string) => {
    updateSearchParams("orderBy", value);
  };

  const handlePage = (value: string) => {
    updateSearchParams("page", value);
  };

  const handleLimit = (value: string) => {
    updateSearchParams("limit", value);
  };

  const updateParams = (key: string, value: string) => {
    if (!key) {
      console.error("Chave e valor devem ser fornecidos.");
      return;
    }
    if (key === "sortOrder") {
      const currentOrder = queryParams.get("sortOrder") || "ASC";
      queryParams.set("sortOrder", currentOrder === "ASC" ? "DESC" : "ASC");
    }
    updateSearchParams(key, value);
  };

  const clearParams = () => {
    router.replace("");
  };

  return {
    updateParams,
    handleSort,
    handlePage,
    handleFromDate,
    handleLimit,
    clearParams,
    handleOrderBy,
    handleSearchParam,
    handleEndDate,
    params: Object.fromEntries(queryParams),
  };
};
type ValidationOptions<T> =
  | { type: 'enum'; enum: T[] }  // Validação por enum
  | { type: 'number' }           // Validação para número
  | { type: 'custom'; validate: (value: unknown) => value is T };

export const useQueryState = <T>(key: string, defaultValue: T, options?: ValidationOptions<T>) => {
  const { getParam, setParam } = useQueryParams();


  const rawValue = getParam(key, defaultValue) as unknown;

  const isValidValue = (value: unknown): value is T => {
    if (!options) return true
    switch (options.type) {
      case 'enum': {
        return options.enum.includes(value as T);
      }
      case 'number': {
        return typeof value === 'number' && !isNaN(value);
      }
      default: {
        return false
      }
    }
  }

  const value: T = isValidValue(rawValue) ? (rawValue as T) : defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      setParam(key, newValue);
    },
    [key, setParam]
  );


  return [value, setValue] as const;
};