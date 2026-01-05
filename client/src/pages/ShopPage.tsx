import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePaginationParams } from '../hooks/usePaginationParams';
import { useGetProductsQuery } from '../features/products/productApi';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/common/Pagination';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const ShopPage = () => {
  const { page, limit, setPage, setLimit } = usePaginationParams({
    defaultLimit: 12,
  });

  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(categorySlug && { category: categorySlug }),
    ...(debouncedSearch && { search: debouncedSearch }),
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Plants</h1>
          <p className="text-gray-600 mt-2">
            Showing {products.length} of {metadata.total} products
          </p>
        </div>

        <div className="relative w-full md:w-64 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setPage(1);
            }}
            className="text-primary-600 hover:underline mt-2 inline-block"
          >
            Clear Search
          </button>
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
