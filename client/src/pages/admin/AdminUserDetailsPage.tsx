import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../../features/users/userApi';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
  Package,
  MapPin,
} from 'lucide-react';

const AdminUserDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetUserQuery(id || '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Users
        </button>
        <div className="text-center text-red-500 py-12">
          User not found or an error occurred.
        </div>
      </div>
    );
  }

  const { user } = data;
  const addresses = (user as any).addresses || [];
  const ordersCount = (user as any).ordersCount || 0;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Users
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {user.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }`}
              >
                <Shield size={12} className="mr-1" />
                {user.role}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {user.status === 'active' ? (
                  <CheckCircle size={12} className="mr-1" />
                ) : (
                  <Ban size={12} className="mr-1" />
                )}
                {user.status === 'active' ? 'Active' : 'Blocked'}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
            User ID: #{user.id}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">
              Contact Info
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Mail size={18} className="mr-3 text-gray-400" />
              {user.email}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar size={18} className="mr-3 text-gray-400" />
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">
              Activity
            </h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Package size={18} className="mr-3 text-gray-400" />
              Total Orders: {ordersCount}
              {ordersCount > 0 && (
                <button
                  onClick={() => navigate(`/admin/orders?userId=${user.id}`)}
                  className="ml-3 text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline focus:outline-none"
                >
                  View History
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <MapPin size={18} className="mr-2" /> Addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No addresses found for this user.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600 shadow-sm"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {addr.fullName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {addr.country}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
