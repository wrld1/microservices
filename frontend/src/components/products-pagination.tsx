import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface ProductsPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  limit: number
  onLimitChange: (limit: number) => void
  totalItems: number
}

export function ProductsPagination({
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  totalItems,
}: ProductsPaginationProps) {
  const endItem = Math.min(page * limit, totalItems)

  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="font-semibold text-foreground">{endItem}</strong>{" "}
          of{" "}
          <strong className="font-semibold text-foreground">
            {totalItems}
          </strong>{" "}
          items
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Show</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(Number(value))
            }}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Size</SelectLabel>
                <SelectItem value="4">4 items</SelectItem>
                <SelectItem value="8">8 items</SelectItem>
                <SelectItem value="12">12 items</SelectItem>
                <SelectItem value="24">24 items</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1

              if (
                totalPages > 5 &&
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                Math.abs(pageNumber - page) > 1
              ) {
                if (pageNumber === 2 && page > 3) {
                  return (
                    <PaginationItem key="dots1">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                if (pageNumber === totalPages - 1 && page < totalPages - 2) {
                  return (
                    <PaginationItem key="dots2">
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(pageNumber)
                    }}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </footer>
  )
}
