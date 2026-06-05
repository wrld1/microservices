import type { CreateProductPayload, GetProductsQuery, PaginatedProductsResponse, Product } from "@/interfaces/product";


const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export async function fetchProducts(params: GetProductsQuery): Promise<PaginatedProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.set("page", String(params.page));
  if (params.limit !== undefined) queryParams.set("limit", String(params.limit));
  if (params.search) queryParams.set("search", params.search);
  if (params.minPrice !== undefined) queryParams.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) queryParams.set("maxPrice", String(params.maxPrice));

  const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch products");
  }

  const result = await response.json();

  // Normalize structure for frontend resilience
  let data: Product[] = [];
  let total = 0;
  const page = params.page || 1;
  const limit = params.limit || 10;

  if (Array.isArray(result)) {
    data = result;
    total = result.length;
  } else if (result && typeof result === "object") {
    data = result.data || result.products || result.items || [];
    total = typeof result.total === "number" ? result.total : data.length;
  }

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function createProduct(dto: CreateProductPayload): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (Array.isArray(errorData.message)) {
      throw new Error(errorData.message.join(", "));
    }
    throw new Error(errorData.message || "Failed to create product");
  }

  return response.json();
}

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }

  return response.json();
}
