import { Link } from 'react-router-dom';
import { usePaginationParams } from '../hooks/usePaginationParams';
import { useGetProductsQuery } from '../features/products/productApi';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/common/Pagination';
import { Loader2 } from 'lucide-react';

const ShopPage = () => {
  const { page, limit, setPage, setLimit } = usePaginationParams({
    defaultLimit: 12,
  });

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  }).toString();

  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  const products = data?.products || [];
  const metadata = data?.metadata || { total: 0, totalPages: 1 };

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

          <Pagination
            currentPage={page}
            totalPages={metadata.totalPages}
            onPageChange={setPage}
            itemsPerPage={limit}
            onItemsPerPageChange={setLimit}
            totalItems={metadata.total}
            pageSizeOptions={[8, 12, 24, 48]}
            className="mt-12"
          />
        </>
      )}
    </div>
  );
};

export default ShopPage;
