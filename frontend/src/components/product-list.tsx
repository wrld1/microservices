import { Package, FolderOpen } from "lucide-react"
import RemoveProductDialog from "./remove-product-dialog"
import { Spinner } from "./ui/spinner"
import ErrorState from "./error-state"
import type { PaginatedProductsResponse } from "@/interfaces/product"
import { Card, CardContent, CardFooter } from "./ui/card"

interface ProductListProps {
  isLoading: boolean
  isError: boolean
  data?: PaginatedProductsResponse
}

export default function ProductList({
  isLoading,
  isError,
  data,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <>
      {data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((product) => (
            <Card
              key={product.id}
              className="group relative flex flex-col overflow-hidden pt-0 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
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

              <CardContent className="flex flex-1 flex-col">
                <div className="mb-2">
                  <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                </div>

                <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>

              <CardFooter className="mt-auto flex items-center justify-between border-t border-border/40">
                <span className="font-mono text-xs text-muted-foreground">
                  Id: {product.id}
                </span>

                <RemoveProductDialog product={product} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-xs">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 text-base font-bold text-foreground">
            No products found
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            There are no products listed matching your query criteria. Try
            clearing filters or create a new product catalog item.
          </p>
        </div>
      )}
    </>
  )
}
