import { api } from '../../services/api';

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  razorpayOrderId: string;
}

export const checkoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<{ addresses: Address[] }, void>({
      query: () => '/addresses',
      transformResponse: (response: { data: { addresses: Address[] } }) =>
        response.data,
      providesTags: ['Addresses'],
    }),
    addAddress: builder.mutation<{ address: Address }, Partial<Address>>({
      query: (address) => ({
        url: '/addresses',
        method: 'POST',
        body: address,
      }),
      transformResponse: (response: { data: { address: Address } }) =>
        response.data,
      invalidatesTags: ['Addresses'],
    }),
    createOrder: builder.mutation<
      {
        orderId: number;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        key: string;
      },
      { addressId: number; courierId?: string }
    >({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      transformResponse: (response: {
        data: {
          orderId: number;
          razorpayOrderId: string;
          amount: number;
          currency: string;
          key: string;
        };
      }) => response.data,
    }),
    verifyPayment: builder.mutation<
      void,
      { razorpayOrderId: string; razorpayPaymentId: string; signature: string }
    >({
      query: (body) => ({
        url: '/orders/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (_response: { data: { order: any } }) => undefined,
      invalidatesTags: ['Cart', 'Orders'],
    }),
    getShippingRates: builder.mutation<
      any[],
      {
        pickup_pincode: number;
        delivery_pincode: number;
        weight: number;
        length?: number;
        breadth?: number;
        height?: number;
        cod?: boolean;
      }
    >({
      query: (body) => ({
        url: '/shipping/rates',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: any[] }) => response.data,
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetShippingRatesMutation,
} = checkoutApi;
