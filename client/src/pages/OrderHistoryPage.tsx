import { useGetMyOrdersQuery } from '../features/orders/orderApi';
import { Loader2, Package } from 'lucide-react';

const OrderHistoryPage = () => {
  const { data, isLoading, error } = useGetMyOrdersQuery(1);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load orders.
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-gray-900">No orders yet</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50">
                <div>
                  <div className="text-sm text-gray-500">Order #{order.id}</div>
                  <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <div className="font-bold text-lg">₹{order.total}</div>
                </div>
              </div>
              
              <div className="p-6">
                {order.items.map((item) => (
                   <div key={item.id} className="flex items-center gap-4 mb-4 last:mb-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        {item.product?.images?.[0]?.url && (
                          <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.product?.price}</div>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
