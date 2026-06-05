import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProduct } from "@/api/products"
import { RefreshCw, Trash2, Trash2Icon } from "lucide-react"
import type { Product } from "@/interfaces/product"

export default function RemoveProductDialog({ product }: { product: Product }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(product.id)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus:opacity-100"
          title="Delete Product"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center font-bold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action will permanently delete{" "}
            <strong className="font-semibold text-foreground">
              "{product.name}"
            </strong>
            . This operation cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
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
  )
}
