import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productApi';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const ShopPage = () => {
  const { data, isLoading, error } = useGetProductsQuery();

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

  const products = data?.products || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Plants</h1>
          <p className="text-gray-600 mt-2">Found {products.length} products</p>
        </div>
        
        {/* Sort/Filter controls could go here */}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
           <h3 className="text-xl font-medium text-gray-900">No products found</h3>
           <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block">Return Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
