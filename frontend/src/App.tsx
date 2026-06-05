import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/api/products"
import Header from "./components/header"
import { ProductsPagination } from "@/components/products-pagination"
import {
  ProductsFilters,
  type ProductFilters,
} from "@/components/products-filters"
import ProductList from "./components/product-list"
import CreateProductDialog from "./components/create-product-dialog"

export function App() {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(8)
  const [filters, setFilters] = React.useState<ProductFilters>({
    search: "",
  })

  const handleFiltersChange = React.useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters)
      setPage(1)
    },
    []
  )

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", { page, limit, ...filters }],
    queryFn: () => fetchProducts({ page, limit, ...filters }),
  })

  const totalItems = data?.meta.total || 0
  const totalPages = data?.meta.totalPages || 0

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 text-foreground transition-colors duration-200">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <ProductsFilters
          onFiltersChange={handleFiltersChange}
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
