import { api } from '../../services/api';
import { setCredentials } from './authSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user, token: data.token }));
        } catch (err) {
          // Handle error
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user, token: data.token }));
        } catch (err) {
          // Handle error
        }
      },
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = localStorage.getItem('token');
          if (token) {
            dispatch(setCredentials({ user: data.data.user, token }));
          }
        } catch (err) {
          // Handle error or clear token if invalid
          localStorage.removeItem('token');
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
