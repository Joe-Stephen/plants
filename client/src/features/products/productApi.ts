import { api } from '../../services/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  categoryId: number;
  images: { id: number; url: string; isPrimary: boolean }[];
}


interface ApiResponse<T> {
  status: string;
  data: T;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[]; metadata: any }, string | void>({
      query: (queryString) => (queryString ? `/products?${queryString}` : '/products'),
      transformResponse: (response: ApiResponse<{ products: Product[]; metadata: any }>) => response.data,
      providesTags: ['Products'],
    }),
    getProductById: builder.query<{ product: Product }, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<{ product: Product }>) => response.data,
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
