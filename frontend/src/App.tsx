import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/api/products"
import Header from "./components/header"
import { ProductsPagination } from "@/components/products-pagination"
import { ProductsFilters } from "@/components/products-filters"
import ProductList from "./components/product-list"
import CreateProductDialog from "./components/create-product-dialog"
import useDebounce from "./lib/hooks/useDebounce"

export function App() {
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

  const { data, isLoading, isError, isFetching } = useQuery({
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

  const handleClearFilters = () => {
    setSearch("")
    setMinPriceInput("")
    setMaxPriceInput("")
    setPage(1)
  }

  const totalItems = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 text-foreground transition-colors duration-200">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <ProductsFilters
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          minPriceInput={minPriceInput}
          onMinPriceChange={(v) => {
            setMinPriceInput(v)
            setPage(1)
          }}
          maxPriceInput={maxPriceInput}
          onMaxPriceChange={(v) => {
            setMaxPriceInput(v)
            setPage(1)
          }}
          onClearFilters={handleClearFilters}
          isFetching={isFetching}
        />

        <CreateProductDialog />

        <ProductList isLoading={isLoading} isError={isError} data={data} />

        {!isLoading && !isError && totalItems > 0 && (
          <ProductsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
            totalItems={totalItems}
          />
        )}
      </main>
    </div>
  )
}

export default App
