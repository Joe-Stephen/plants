import { useState } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '../../features/orders/orderApi';
import { Loader2, Filter } from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import { usePaginationParams } from '../../hooks/usePaginationParams';

const AdminOrdersPage = () => {
  const { page, limit, setPage, setLimit } = usePaginationParams();
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    status: statusFilter,
  });
  const [updateStatus] = useUpdateOrderStatusMutation();

  if (isLoading)
    return (
      <div className="p-10 text-center flex justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );

  const orders = data?.orders || [];
  const metadata = data?.metadata || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h1>
          <p className="text-gray-500">View and update customer orders</p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Order ID</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Amount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {order.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'DELIVERED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus({ id: order.id, status: e.target.value })
                        }
                        className="text-sm border-gray-300 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-1.5"
                        disabled={
                          order.status === 'DELIVERED' ||
                          order.status === 'CANCELLED'
                        }
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-gray-50 border-t">
          <Pagination
            currentPage={metadata.page}
            totalPages={metadata.totalPages}
            onPageChange={setPage}
            itemsPerPage={limit}
            onItemsPerPageChange={setLimit}
            totalItems={metadata.total}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
