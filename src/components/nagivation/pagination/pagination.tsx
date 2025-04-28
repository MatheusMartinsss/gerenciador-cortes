"use client"
import { useQueryState } from '@/hooks/useSearchParams'
import { Button } from "@/components/ui/button"
import { ChevronsRight, ChevronsLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PaginationProps {
    pages: number
}

export function TablePagination({ pages, }: PaginationProps) {
    const [page, setPage] = useQueryState('page', 1)
    const [limit, setLimit] = useQueryState('limit', 10)

    let currentPage = Number(page)
    let prevPage = currentPage <= 2 ? 1 : currentPage - 1
    let endPreviousPage = currentPage - 1;
    let startNexPage = currentPage + 1;
    let endNextPage = currentPage + 2 > pages ? pages : currentPage + 2;
    let lastPage = pages

    const previousPages: number[] = [];
    for (let i = prevPage; i <= endPreviousPage; i++) {
        previousPages.push(i);
    }

    const nextPages: number[] = [];
    for (let i = startNexPage; i <= endNextPage; i++) {
        nextPages.push(i);
    }
    const handlePage = (page: string) => {
        setPage(parseInt(page))
    }
    const handlePreviousPage = () => {
        if (currentPage <= 1) return
        handlePage(String(currentPage - 1))
    }
    const handleDoublePreviousPage = () => {
        if (currentPage <= 1) return
        if (currentPage == 2) {
            handlePage(String(currentPage - 1))
        } else {
            handlePage(String(currentPage - 2))
        }
    }
    const handleNextPage = () => {
        if (currentPage == pages) return
        handlePage(String(currentPage + 1))
    }
    const handleDoublePage = () => {
        if (currentPage == pages) return
        if (currentPage == pages - 1) {
            handlePage(String(currentPage + 1))
        } else {
            handlePage(String(currentPage + 2))
        }
    }
    let skipLastPage = currentPage !== lastPage && !nextPages.includes(lastPage)
    let skipFirstPage = currentPage !== 1 && !previousPages.includes(1)
    return (
        <div className='flex justify-end w-full items-center '>
            <div className='flex space-x-2'>
                <div className='items-center flex text-white'>
                    <Label>Pagina {page} de {pages}</Label>
                </div>
                <Button className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleDoublePreviousPage}>
                    <ChevronsLeft className='h-4 w-4 text-white' />
                </Button>
                <Button className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handlePreviousPage}>
                    <ChevronLeft className='h-4 w-4 text-white' />
                </Button>
                <Button className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleNextPage}>
                    <ChevronRight className='h-4 w-4 text-white' />
                </Button>
                <Button className='p-2 hover:bg-black hover:bg-opacity-30' variant='ghost' onClick={handleDoublePage}>
                    <ChevronsRight className='h-4 w-4 text-white' />
                </Button>
            </div>
        </div>
    )
}