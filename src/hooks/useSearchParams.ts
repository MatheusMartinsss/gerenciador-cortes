import { useSearchParams, useRouter } from "next/navigation";

export const useParams = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const queryParams = Object.fromEntries(searchParams);
    let optionsSelected = 0;
    let maxOptionsSelect = 3;
    const handleSort = () => {
        if (optionsSelected >= maxOptionsSelect) {
            delete queryParams['sortOrder']
            delete queryParams['orderBy']
        } else {
            const currentOrder = queryParams['sortOrder'] || 'asc'
            queryParams['sortOrder'] = currentOrder === 'asc' ? 'desc' : 'asc'
            optionsSelected++;
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handleFromDate = (value: string) => {
        if (!value) {
            delete queryParams['from']
        } else {
            queryParams['from'] = value
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handlePage = (value: string) => {
        if (!value) {
            delete queryParams['page']
        } else {
            queryParams['page'] = value
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handleLimit = (value: string) => {
        const limits = [10, 20,]
        queryParams['limit'] = '10'
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handleEndDate = (value: string) => {
        if (!value) {
            delete queryParams['end']
        } else {
            queryParams['end'] = value
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handleSearchParam = (value: string) => {
        if (value == '') {
            delete queryParams['searchParam']
        } else {
            queryParams['searchParam'] = value
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const handleOrderBy = (value: string) => {
        if (value == '') {
            delete queryParams['orderBy']
        } else {
            queryParams['orderBy'] = value
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    }
    const updateParams = (key: string, value: string) => {
        if (!key) {
            console.error("Chave e valor devem ser fornecidos.");
            return;
        }
        if (key === 'orderBy') {
            const currentOrder = queryParams['order'] || 'asc';
            queryParams['order'] = currentOrder === 'asc' ? 'desc' : 'asc';
        }
        if (value === '') {
            delete queryParams[key];
        } else {
            queryParams[key] = value;
        }
        const newSearchParams = new URLSearchParams(queryParams);
        router.push(`?${newSearchParams}`);
    };
    const clearParams = () => {

    }

    return {
        updateParams,
        handleSort,
        handlePage,
        handleFromDate,
        clearParams,
        handleOrderBy,
        handleSearchParam,
        handleEndDate,
        params: Object.fromEntries(searchParams)
    };
}