import { useQueryState } from 'next-usequerystate'
import { SortingState } from '@tanstack/react-table'

export function useTableQueryParams(defaultOrderBy = '', defaultOrder: 'asc' | 'desc' | '' = '', defaultLimit = 10) {
    const [search, setSearch] = useQueryState('search', {
        defaultValue: '',
        parse: (v) => (v.trim().length == 0 ? null : v),
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [dateField, setDateField] = useQueryState('dateField', {
        defaultValue: '',
        parse: (v) => v ?? 'createdAt',
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [from, setFrom] = useQueryState('from', {
        defaultValue: '',
        parse: (v) => v ?? '',
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [to, setTo] = useQueryState('to', {
        defaultValue: '',
        parse: (v) => v ?? null,
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [pageStr, setPage] = useQueryState('page', {
        defaultValue: '1',
        parse: (v) => v ?? '1',
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [limitStr, setLimit] = useQueryState('limit', {
        defaultValue: String(defaultLimit),
        parse: (v) => v ?? String(defaultLimit),
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [orderBy, setOrderBy] = useQueryState('orderBy', {
        defaultValue: defaultOrderBy,
        parse: (v) => v ?? defaultOrderBy,
        serialize: (v) => v,
        clearOnDefault: true
    })

    const [order, setOrder] = useQueryState<'asc' | 'desc' | ''>('order', {
        defaultValue: defaultOrder,
        parse: (v): 'asc' | 'desc' | '' => {
            if (v === 'asc' || v === 'desc') return v;
            return '';
        },
        serialize: (v) => v,
        clearOnDefault: true,
    })

    const clearFilters = () => {
        setSearch("");
        setFrom("");
        setTo("");
        setDateField("");
        setOrderBy(null);
        setOrder(null);
        setPage('1');
        setLimit(null);
    };
    const page = parseInt(pageStr || '1', 10)
    const limit = parseInt(limitStr || '10', 10)

    const sorting: SortingState = orderBy
        ? [{ id: orderBy, desc: order === 'desc' }]
        : []

    const setSorting = (updater: SortingState | ((old: SortingState) => SortingState)) => {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater
        if (newSorting.length) {
            setOrderBy(newSorting[0].id)
            setOrder(newSorting[0].desc ? 'desc' : 'asc')
        } else {
            setOrderBy(null)
            setOrder(null)
        }
    }

    const setPagination = (newPage: number, newLimit?: number) => {
        setPage(String(newPage))
        if (newLimit) setLimit(String(newLimit))
    }

    return {
        search,
        setSearch,
        from,
        setFrom,
        to,
        setTo,
        page,
        limit,
        setPagination,
        dateField,
        setDateField,
        sorting,
        orderBy,
        order,
        setSorting,
        setOrderBy,
        clearFilters
    }
}
