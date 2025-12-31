import { api } from '../../services/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  categoryId: number;
  careInstructions?: string;
  images: { id: number; url: string; is_primary: boolean }[];
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      { products: Product[]; metadata: any },
      string | void
    >({
      query: (queryString) =>
        queryString ? `/products?${queryString}` : '/products',
      transformResponse: (
        response: ApiResponse<{ products: Product[]; metadata: any }>,
      ) => response.data,
      providesTags: ['Products'],
    }),
    getProductById: builder.query<{ product: Product }, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<{ product: Product }>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation<{ product: Product }, FormData>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<
      { product: Product },
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Products',
        { type: 'Products', id },
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProductImage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, _id) => ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
} = productApi;
