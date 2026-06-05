import { Search, SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  minPriceInput: string
  onMinPriceChange: (value: string) => void
  maxPriceInput: string
  onMaxPriceChange: (value: string) => void
  onClearFilters: () => void
  isFetching: boolean
}

export function ProductsFilters({
  search,
  onSearchChange,
  minPriceInput,
  onMinPriceChange,
  maxPriceInput,
  onMaxPriceChange,
  onClearFilters,
  isFetching,
}: ProductsFiltersProps) {
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
        <div className="relative md:col-span-2">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 py-2.5 pr-4 pl-10 text-sm shadow-xs outline-hidden transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <input
            type="number"
            placeholder="Min Price"
            value={minPriceInput}
            onChange={(e) => onMinPriceChange(e.target.value)}
            min="0"
            className="w-full rounded-xl border border-input bg-background/50 py-2.5 pr-4 pl-8 text-sm shadow-xs outline-hidden transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPriceInput}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            min="0"
            className="w-full rounded-xl border border-input bg-background/50 py-2.5 pr-4 pl-8 text-sm shadow-xs outline-hidden transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
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
            variant="ghost"
            size="xs"
            onClick={onClearFilters}
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </section>
  )
}
