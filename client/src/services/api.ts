import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({

  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Products', 'Cart', 'Orders', 'Addresses'],
  endpoints: () => ({}),
});
