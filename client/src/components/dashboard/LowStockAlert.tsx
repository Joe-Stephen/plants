import { AlertTriangle } from 'lucide-react';
import { useGetLowStockQuery } from '../../features/analytics/analyticsApi';

interface Product {
  id: number;
  name: string;
  stock: number;
}

const LowStockAlert = () => {
  const { data: products = [], isLoading } = useGetLowStockQuery(10); // Default threshold 10

  if (isLoading || products.length === 0) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-orange-900">Low Stock Alert</h3>
          <p className="text-sm text-orange-700 mt-1">
            The following products are running low on stock ({'<'} 10 items):
          </p>
          <ul className="mt-3 space-y-1">
            {products.slice(0, 5).map((product: Product) => (
              <li
                key={product.id}
                className="text-sm text-orange-800 flex justify-between items-center bg-white/50 p-2 rounded"
              >
                <span>{product.name}</span>
                <span className="font-mono font-medium bg-white px-2 py-0.5 rounded text-xs border border-orange-100">
                  {product.stock} remaining
                </span>
              </li>
            ))}
          </ul>
          {products.length > 5 && (
            <p className="text-xs text-orange-600 mt-2 font-medium">
              + {products.length - 5} more items
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
