export interface Product {
  id: string
  name: string
  description: string
  price: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductPayload {
  name: string
  description: string
  price: number
}

export interface GetProductsQuery {
  page?: number
  limit?: number
  search?: string
  minPrice?: number
  maxPrice?: number
}

// export interface PaginatedProductsResponse {
//   data: Product[];
//   total: number;
//   page: number;
//   limit: number;
// }

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedProductsResponse {
  data: Product[]
  meta: PaginationMeta
}
