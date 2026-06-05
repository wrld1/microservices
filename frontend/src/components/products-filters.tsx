import { useEffect, useState } from "react"
import { Search, SlidersHorizontal, RefreshCw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import useDebounce from "@/lib/hooks/useDebounce"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

export interface ProductFilters {
  search: string
  minPrice?: number
  maxPrice?: number
}

interface ProductsFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
  isFetching: boolean
}

export function ProductsFilters({
  onFiltersChange,
  isFetching,
}: ProductsFiltersProps) {
  const [search, setSearch] = useState("")
  const [minPriceInput, setMinPriceInput] = useState("")
  const [maxPriceInput, setMaxPriceInput] = useState("")

  const debouncedSearch = useDebounce(search, 300)
  const debouncedMinPrice = useDebounce(minPriceInput, 300)
  const debouncedMaxPrice = useDebounce(maxPriceInput, 300)

  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch,
      minPrice:
        debouncedMinPrice !== "" ? Number(debouncedMinPrice) : undefined,
      maxPrice:
        debouncedMaxPrice !== "" ? Number(debouncedMaxPrice) : undefined,
    })
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice, onFiltersChange])

  const hasActiveFilters = search || minPriceInput || maxPriceInput

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-2">
        <SlidersHorizontal className="h-4.5 w-4.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground">
          Filters &amp; Search
        </h2>
        {isFetching && (
          <RefreshCw className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <InputGroup className="md:col-span-2">
          <InputGroupInput
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="number"
            placeholder="Min Price"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            min="0"
          />
          <InputGroupAddon>
            <DollarSign />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="number"
            placeholder="Max Price"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            min="0"
          />
          <InputGroupAddon>
            <DollarSign />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-3">
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Active Filters:</span>
            {search && (
              <span className="font-semibold text-foreground">
                Search: &ldquo;{search}&rdquo;
              </span>
            )}
            {minPriceInput && (
              <span className="font-semibold text-foreground">
                Min: ${minPriceInput}
              </span>
            )}
            {maxPriceInput && (
              <span className="font-semibold text-foreground">
                Max: ${maxPriceInput}
              </span>
            )}
          </div>
          <Button
            variant="destructive"
            size="xs"
            onClick={() => {
              setSearch("")
              setMinPriceInput("")
              setMaxPriceInput("")
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </section>
  )
}
