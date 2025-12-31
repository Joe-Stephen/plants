import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productApi';
import ProductCard from '../components/ProductCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const ShopPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  const products = data?.products || [];
  const metadata = data?.metadata || { total: 0, totalPages: 1 };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= metadata.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Plants</h1>
          <p className="text-gray-600 mt-2">
            Showing {products.length} of {metadata.total} products
          </p>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to first page on limit change
            }}
            className="border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 p-1.5 border"
          >
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-medium text-gray-900">
            No products found
          </h3>
          <Link
            to="/"
            className="text-primary-600 hover:underline mt-2 inline-block"
          >
            Return Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {metadata.totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-sm font-medium text-gray-700">
                Page {page} of {metadata.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === metadata.totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopPage;
