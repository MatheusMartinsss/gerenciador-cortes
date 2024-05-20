"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useParams } from "@/hooks/useSearchParams"

interface PaginationProps {
    handlePage: (page: number) => void
    params: any
    pages: number
}

export function TablePagination({ pages, handlePage, params }: PaginationProps) {
    const { page = 1, limit = 10 } = params

    let currentPage = Number(page)
    let prevPage = currentPage <= 2 ? 1 : currentPage - 1
    let endPreviousPage = currentPage - 1;
    let startNexPage = currentPage + 1;
    let endNextPage = currentPage + 2 > pages ? pages : currentPage + 2;

    const previousPages: number[] = [];
    for (let i = prevPage; i <= endPreviousPage; i++) {
        previousPages.push(i);
    }

    const nextPages: number[] = [];
    for (let i = startNexPage; i <= endNextPage; i++) {
        nextPages.push(i);
    }
    const handlePreviousPage = () => {
        if (currentPage <= 1) return
        handlePage((currentPage - 1))
    }
    const handleNextPage = () => {
        if (currentPage == pages) return
        handlePage((currentPage + 1))
    }
    return (
        <Pagination >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePreviousPage} />
                </PaginationItem>
                {previousPages.map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePage(page)}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem>
                    <PaginationLink isActive>
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>
                {nextPages.map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePage(page)}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem>
                    <PaginationNext onClick={handleNextPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}