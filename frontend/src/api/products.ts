import type {
  CreateProductPayload,
  GetProductsQuery,
  PaginatedProductsResponse,
  Product,
} from "@/interfaces/product"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message || response.statusText
    throw new Error(message)
  }
  return response.json()
}

function toSearchParams(params: Record<string, unknown>): URLSearchParams {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  )
}

export async function fetchProducts(
  params: GetProductsQuery
): Promise<PaginatedProductsResponse> {
  const query = toSearchParams({ ...params })
  return request<PaginatedProductsResponse>(
    `${BASE_URL}/products?${query}`
  )
}

export async function createProduct(
  dto: CreateProductPayload
): Promise<Product> {
  return request<Product>(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  })
}
