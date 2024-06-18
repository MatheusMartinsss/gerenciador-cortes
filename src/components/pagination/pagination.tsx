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
    let lastPage = pages

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
    let skipLastPage = currentPage !== lastPage && !nextPages.includes(lastPage)
    let skipFirstPage = currentPage !== 1 && !previousPages.includes(1)
    return (
        <Pagination >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious size='sm' onClick={handlePreviousPage} />
                </PaginationItem>
                {skipFirstPage && (
                    <div className="flex flex-row">
                        <PaginationItem key={1}>
                            <PaginationLink size='sm' onClick={() => handlePage(1)}>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="flex">
                            <PaginationEllipsis ></PaginationEllipsis>
                        </PaginationItem>
                    </div>
                )}
                {previousPages.map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink size='sm' onClick={() => handlePage(page)}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem>
                    <PaginationLink isActive size='sm'>
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>
                {nextPages.map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink size='sm' onClick={() => handlePage(page)}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                {skipLastPage && (
                    <div className="flex flex-row">
                        <PaginationItem className="flex">
                            <PaginationEllipsis ></PaginationEllipsis>
                        </PaginationItem>
                        <PaginationItem key={lastPage}>
                            <PaginationLink size='sm' onClick={() => handlePage(lastPage)}>{lastPage}</PaginationLink>
                        </PaginationItem>
                    </div>
                )}
                <PaginationItem>
                    <PaginationNext size='sm' onClick={handleNextPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}