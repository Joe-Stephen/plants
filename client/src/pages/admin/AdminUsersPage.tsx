import { useState } from 'react';
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from '../../features/users/userApi';
import { useDebounce } from '../../hooks/useDebounce';
import { usePaginationParams } from '../../hooks/usePaginationParams';
import Pagination from '../../components/common/Pagination';
import { Search, Loader2, Shield, ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AdminUsersPage = () => {
  const { page, limit, setPage, setLimit } = usePaginationParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const currentUser = useSelector((state: any) => state.auth.user);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(debouncedSearch && { search: debouncedSearch }),
  }).toString();

  const { data, isLoading } = useGetUsersQuery(queryParams);
  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const users = data?.users || [];
  const metadata = data?.metadata || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleRoleChange = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promote' : 'demote';

    if (
      !window.confirm(
        `Are you sure you want to ${action} this user to ${newRole}?`,
      )
    )
      return;

    try {
      setUpdatingId(id);
      await updateUserRole({ id, role: newRole }).unwrap();
      toast.success(`User ${action}d successfully`);
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage registered customers
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  ID
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Email
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Role
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Joined Date
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    #{user.id}
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      disabled={
                        (isUpdating && updatingId === user.id) ||
                        user.id === currentUser?.id
                      }
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.role === 'ADMIN'
                          ? 'text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                          : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={
                        user.id === currentUser?.id
                          ? 'You cannot change your own role'
                          : user.role === 'ADMIN'
                            ? 'Demote to User'
                            : 'Promote to Admin'
                      }
                    >
                      {isUpdating && updatingId === user.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : user.role === 'ADMIN' ? (
                        <>
                          <ShieldAlert size={16} /> Demote
                        </>
                      ) : (
                        <>
                          <Shield size={16} /> Make Admin
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {metadata.total > 0 && (
          <Pagination
            currentPage={metadata.page}
            totalPages={metadata.totalPages}
            onPageChange={setPage}
            itemsPerPage={limit}
            onItemsPerPageChange={setLimit}
            totalItems={metadata.total}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
