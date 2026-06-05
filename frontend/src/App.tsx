import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Package,
  Plus,
  Trash2,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Info,
  Sun,
  Moon,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider.tsx"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchProducts, createProduct, deleteProduct } from "@/api/products"
import Header from "./components/header"

// Custom debounce hook for filters
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function App() {
  const queryClient = useQueryClient()

  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(8)
  const [search, setSearch] = React.useState("")
  const [minPriceInput, setMinPriceInput] = React.useState("")
  const [maxPriceInput, setMaxPriceInput] = React.useState("")

  const debouncedSearch = useDebounce(search, 300)
  const debouncedMinPrice = useDebounce(minPriceInput, 300)
  const debouncedMaxPrice = useDebounce(maxPriceInput, 300)

  const parsedMinPrice =
    debouncedMinPrice !== "" ? Number(debouncedMinPrice) : undefined
  const parsedMaxPrice =
    debouncedMaxPrice !== "" ? Number(debouncedMaxPrice) : undefined

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "products",
      {
        page,
        limit,
        search: debouncedSearch,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
      },
    ],
    queryFn: () =>
      fetchProducts({
        page,
        limit,
        search: debouncedSearch,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
      }),
  })

  const [createOpen, setCreateOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [newDescription, setNewDescription] = React.useState("")
  const [newPrice, setNewPrice] = React.useState("")
  const [formErrors, setFormErrors] = React.useState<{
    name?: string
    description?: string
    price?: string
  }>({})

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setCreateOpen(false)
      // Reset form fields
      setNewName("")
      setNewDescription("")
      setNewPrice("")
      setFormErrors({})
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: typeof formErrors = {}

    if (!newName.trim()) {
      errors.name = "Product name is required"
    }
    if (!newDescription.trim()) {
      errors.description = "Description is required"
    }

    const priceNum = parseFloat(newPrice)
    if (isNaN(priceNum)) {
      errors.price = "Price must be a valid number"
    } else if (priceNum <= 0) {
      errors.price = "Price must be a positive number"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    createMutation.mutate({
      name: newName.trim(),
      description: newDescription.trim(),
      price: priceNum,
    })
  }

  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const productToDelete = data?.data.find((p) => p.id === deleteId)

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setDeleteId(null)
    },
  })

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  const handleClearFilters = () => {
    setSearch("")
    setMinPriceInput("")
    setMaxPriceInput("")
    setPage(1)
  }

  const totalItems = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, totalItems)

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 text-foreground transition-colors duration-200">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          onClick={() => setCreateOpen(true)}
          className="group relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Create Product
          </span>
        </Button>

        <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Filters & Search
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
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
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
                onChange={(e) => {
                  setMinPriceInput(e.target.value)
                  setPage(1)
                }}
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
                onChange={(e) => {
                  setMaxPriceInput(e.target.value)
                  setPage(1)
                }}
                min="0"
                className="w-full rounded-xl border border-input bg-background/50 py-2.5 pr-4 pl-8 text-sm shadow-xs outline-hidden transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {(search || minPriceInput || maxPriceInput) && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-3">
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>Active Filters:</span>
                {search && (
                  <span className="font-semibold text-foreground">
                    Search: "{search}"
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
                onClick={handleClearFilters}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
              >
                <div className="relative flex h-44 w-full animate-pulse items-center justify-center bg-linear-to-br from-muted/50 to-muted/20">
                  <Package className="h-10 w-10 text-muted/30" />
                </div>
                <div className="flex flex-1 flex-col space-y-3 p-5">
                  <div className="flex items-start justify-between">
                    <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />
                    <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="space-y-1.5 py-1">
                    <div className="h-3.5 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-3.5 w-5/6 animate-pulse rounded-md bg-muted" />
                  </div>
                  <div className="flex justify-end pt-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center shadow-xs">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-bold text-foreground">
              Query Failure
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "We couldn't connect to the backend services. Please make sure the service is running."}
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-6 gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Try Reconnecting
            </Button>
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                {/* Hover glow highlight */}
                <div className="absolute inset-0 -z-10 bg-linear-to-tr from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Decorative image/box representation */}
                <div className="relative flex h-44 w-full items-center justify-center bg-linear-to-br from-primary/5 to-accent/10 transition-colors group-hover:from-primary/10 group-hover:to-accent/15">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 text-primary shadow-xs transition-transform duration-300 group-hover:scale-110">
                    <Package className="h-8 w-8" />
                  </div>
                  <div className="absolute top-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-primary shadow-xs backdrop-blur-xs">
                    $
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2">
                    <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                  </div>

                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ID: {product.id.slice(0, 8)}...
                    </span>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => setDeleteId(product.id)}
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus:opacity-100"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Catalog State */
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-xs">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-bold text-foreground">
              No products found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              There are no products listed matching your query criteria. Try
              clearing filters or create a new product catalog item.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {(search || minPriceInput || maxPriceInput) && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Query Filters
                </Button>
              )}
              <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Product
              </Button>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !isError && totalItems > 0 && (
          <footer className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
            {/* Info label */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>
                Showing{" "}
                <strong className="font-semibold text-foreground">
                  {startItem}
                </strong>{" "}
                to{" "}
                <strong className="font-semibold text-foreground">
                  {endItem}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-foreground">
                  {totalItems}
                </strong>{" "}
                items
              </span>
            </div>

            {/* Limit Selector & Page Nav */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value))
                    setPage(1)
                  }}
                  className="rounded-lg border border-input bg-card px-2 py-1 text-xs outline-hidden focus:border-primary"
                >
                  <option value={4}>4 items</option>
                  <option value={8}>8 items</option>
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                </select>
              </div>

              {/* Prev / Page numbers / Next buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1
                  // Only display surrounding pages if total is large
                  if (
                    totalPages > 5 &&
                    pageNumber !== 1 &&
                    pageNumber !== totalPages &&
                    Math.abs(pageNumber - page) > 1
                  ) {
                    if (pageNumber === 2 && page > 3) {
                      return (
                        <span
                          key="dots1"
                          className="px-1 text-xs text-muted-foreground"
                        >
                          ...
                        </span>
                      )
                    }
                    if (
                      pageNumber === totalPages - 1 &&
                      page < totalPages - 2
                    ) {
                      return (
                        <span
                          key="dots2"
                          className="px-1 text-xs text-muted-foreground"
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? "default" : "outline"}
                      size="icon-sm"
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-xs font-semibold",
                        page === pageNumber &&
                          "bg-primary text-primary-foreground shadow-xs"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </footer>
        )}
      </main>

      {/* CREATE PRODUCT DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Create New Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new product item to your global storefront catalog
              databases. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="my-2 space-y-4">
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prod-name"
                className="text-xs font-semibold text-foreground"
              >
                Product Name
              </label>
              <input
                id="prod-name"
                type="text"
                placeholder="e.g. Mechanical Keyboard"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  if (formErrors.name)
                    setFormErrors({ ...formErrors, name: undefined })
                }}
                className={cn(
                  "rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                  formErrors.name &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
              />
              {formErrors.name && (
                <span className="text-[11px] font-semibold text-destructive">
                  {formErrors.name}
                </span>
              )}
            </div>

            {/* Price Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prod-price"
                className="text-xs font-semibold text-foreground"
              >
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 99.99"
                  value={newPrice}
                  onChange={(e) => {
                    setNewPrice(e.target.value)
                    if (formErrors.price)
                      setFormErrors({ ...formErrors, price: undefined })
                  }}
                  className={cn(
                    "w-full rounded-xl border border-input bg-background/50 py-2 pr-3 pl-7 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                    formErrors.price &&
                      "border-destructive focus:border-destructive focus:ring-destructive/20"
                  )}
                />
              </div>
              {formErrors.price && (
                <span className="text-[11px] font-semibold text-destructive">
                  {formErrors.price}
                </span>
              )}
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prod-desc"
                className="text-xs font-semibold text-foreground"
              >
                Description
              </label>
              <textarea
                id="prod-desc"
                placeholder="Product description and details..."
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value)
                  if (formErrors.description)
                    setFormErrors({ ...formErrors, description: undefined })
                }}
                rows={3}
                className={cn(
                  "resize-none rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                  formErrors.description &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
              />
              {formErrors.description && (
                <span className="text-[11px] font-semibold text-destructive">
                  {formErrors.description}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateOpen(false)
                  setFormErrors({})
                }}
                disabled={createMutation.isPending}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="gap-1.5 rounded-xl"
              >
                {createMutation.isPending && (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                )}
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE PRODUCT ALERT CONFIRMATION */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-2xl border border-border bg-card p-6">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-center font-bold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs">
              This action will permanently delete{" "}
              <strong className="font-semibold text-foreground">
                "{productToDelete?.name}"
              </strong>
              . This operation cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:justify-center">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              variant="destructive"
              className="gap-1.5 rounded-xl"
            >
              {deleteMutation.isPending && (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default App
