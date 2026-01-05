import { api } from '../../services/api';

export interface OrderItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: string;
    images: { url: string; is_primary: boolean }[];
  };
}

export interface OrderDetail {
  id: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: string;
  razorpayPaymentId?: string;
  createdAt: string;
  items: OrderItem[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<
      { orders: OrderDetail[]; metadata: any },
      number
    >({
      query: (page = 1) => `/orders/my-orders?page=${page}`,
      transformResponse: (response: {
        data: { orders: OrderDetail[]; metadata: any };
      }) => response.data,
      providesTags: ['Orders'],
    }),
    getAllOrders: builder.query<
      { orders: OrderDetail[]; metadata: any },
      { page?: number; status?: string; userId?: string }
    >({
      query: ({ page = 1, status, userId }) => {
        let url = `/orders/admin/all?page=${page}`;
        if (status) url += `&status=${status}`;
        if (userId) url += `&userId=${userId}`;
        return url;
      },
      transformResponse: (response: {
        data: { orders: OrderDetail[]; metadata: any };
      }) => response.data,
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
