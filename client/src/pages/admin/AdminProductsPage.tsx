import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../features/products/productApi';
import {
  Edit2,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminProductsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductsQuery(`page=${page}&limit=10`);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this product? This acton cannot be undone.',
      )
    )
      return;

    try {
      setDeletingId(id);
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  const products = data?.products || [];
  const metadata = data?.metadata || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your product inventory
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Image
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Price
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                  Stock
                </th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images.find((img) => img.is_primary)?.url ||
                            product.images[0].url
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    ₹{product.price}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting && deletingId === product.id}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting && deletingId === product.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No products found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {metadata.totalPages > 1 && (
          <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing page {metadata.page} of {metadata.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(metadata.totalPages, p + 1))
                }
                disabled={page === metadata.totalPages}
                className="p-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
