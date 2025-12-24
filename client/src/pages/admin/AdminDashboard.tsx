import { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/orderApi';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ page: 1, status: statusFilter });
  const [updateStatus] = useUpdateOrderStatusMutation();

  if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline" /></div>;

  const orders = data?.orders || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Total</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">
                  <div className="font-medium">{order.user?.name}</div>
                  <div className="text-sm text-gray-500">{order.user?.email}</div>
                </td>
                <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold">₹{order.total}</td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                   }`}>
                      {order.status}
                   </span>
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                    className="text-sm border rounded p-1"
                    disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
