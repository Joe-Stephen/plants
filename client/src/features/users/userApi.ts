import { api } from '../../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: User[]; metadata: any }, string | void>({
      query: (queryString) =>
        queryString ? `/users?${queryString}` : '/users',
      transformResponse: (
        response: ApiResponse<{ users: User[]; metadata: any }>,
      ) => response.data,
      providesTags: ['User'],
    }),
    getUser: builder.query<{ user: User }, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<{ user: User }>) =>
        response.data,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUserRole: builder.mutation<
      { user: User },
      { id: number; role: 'USER' | 'ADMIN' }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
      ],
      async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            'getUsers',
            undefined,
            (draft: { users: User[] }) => {
              const user = draft.users.find((u) => u.id === id);
              if (user) {
                user.role = role;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateUserStatus: builder.mutation<
      { user: User },
      { id: number; status: 'ACTIVE' | 'BLOCKED' }
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User',
      ],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            'getUsers',
            undefined,
            (draft: { users: User[] }) => {
              const user = draft.users.find((u) => u.id === id);
              if (user) {
                user.status = status === 'ACTIVE' ? 'active' : 'inactive';
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} = userApi;
