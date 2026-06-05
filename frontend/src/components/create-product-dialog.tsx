import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/api/products"
import { useState } from "react"

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>

export default function CreateProductDialog() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: undefined as any,
      description: "",
    },
  })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      reset()
      setOpen(false)
    },
  })

  const onSubmit = async (data: CreateProductFormValues) => {
    await createMutation.mutateAsync(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto w-fit">
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl bg-card p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Create New Product
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new product item to your global storefront catalog databases.
            All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="my-2 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Product Name</label>

            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Mechanical Keyboard"
              className={cn(
                "rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                errors.name &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20"
              )}
            />

            {errors.name && (
              <span className="text-[11px] font-semibold text-destructive">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Price (USD)</label>

            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>

              <input
                {...register("price", {
                  valueAsNumber: true,
                })}
                type="number"
                step="0.01"
                placeholder="e.g. 99.99"
                className={cn(
                  "w-full rounded-xl border border-input bg-background/50 py-2 pr-3 pl-7 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                  errors.price &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
              />
            </div>

            {errors.price && (
              <span className="text-[11px] font-semibold text-destructive">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Description</label>

            <textarea
              {...register("description")}
              rows={3}
              placeholder="Product description and details..."
              className={cn(
                "resize-none rounded-xl border border-input bg-background/50 px-3 py-2 text-sm outline-hidden transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
                errors.description &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20"
              )}
            />

            {errors.description && (
              <span className="text-[11px] font-semibold text-destructive">
                {errors.description.message}
              </span>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5 rounded-xl"
            >
              {isSubmitting && (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              )}
              Save Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
