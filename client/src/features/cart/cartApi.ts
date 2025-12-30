import { api } from '../../services/api';
import type { Product } from '../products/productApi';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<{ cart: Cart }, void>({
      query: () => '/cart',
      transformResponse: (response: { data: { cart: Cart } }) => response.data,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<
      { cart: Cart },
      { productId: number; quantity: number }
    >({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: { cart: Cart } }) => response.data,
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<
      { cart: Cart },
      { id: number; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      transformResponse: (response: { data: { cart: Cart } }) => response.data,
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<{ cart: Cart }, number>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { cart: Cart } }) => response.data,
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
