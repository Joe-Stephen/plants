import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAddToCartMutation } from '../features/cart/cartApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Product } from '../features/products/productApi';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  // Use Product Image or Fallback to Unsplash
  const primaryImage = product.images.length > 0 && product.images[0].url 
  ? product.images[0].url 
  : 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error('Failed to add to cart');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      <Link to={`/shop/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={primaryImage} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        
        {/* Quick Action Overlay */}
        <button 
           className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-sm"
           title="Add to Wishlist"
        >
          <Heart size={18} />
        </button>
      </Link>
      
      <div className="p-5">
        <div className="text-xs font-bold text-primary-600 tracking-wider uppercase mb-1">Indoor</div>
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-primary-700 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-700 hover:bg-primary-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
