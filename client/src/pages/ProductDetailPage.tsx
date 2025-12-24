import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/products/productApi';
import { Loader2, Minus, Plus, ShoppingCart, Star, Truck, Shield } from 'lucide-react';

import { useAddToCartMutation } from '../features/cart/cartApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetProductByIdQuery(Number(id));
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
         <div className="text-2xl font-bold text-gray-800 mb-4">Product not found</div>
         <Link to="/shop" className="text-primary-600 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const { product } = data;
  const images = product.images.length > 0 
    ? product.images 
    : [{ id: 0, url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', isPrimary: true }];

  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity(q => Math.min(product.stock, q + 1));
  
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart({ productId: product.id, quantity }).unwrap();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error('Failed to add to cart');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative group">
            <img 
              src={images[activeImageIndex].url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === index ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold tracking-wider rounded-full uppercase">
              Indoor Plant
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={18} fill="currentColor" />)}
            </div>
            <span className="text-gray-500 text-sm">(124 reviews)</span>
          </div>

          <div className="text-4xl font-bold text-gray-900 mb-8">₹{product.price}</div>
          
          <div className="prose prose-gray max-w-none text-gray-600 mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-100 py-8 mb-8 space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Availability</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-bold flex items-center bg-green-50 px-3 py-1 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">Out of Stock</span>
                )}
             </div>

             <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Select Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button 
                    onClick={handleDecrement}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-all active:scale-95"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-all active:scale-95"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="flex-1 bg-primary-600 text-white rounded-2xl py-4 flex items-center justify-center space-x-2 font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 transform hover:-translate-y-1 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart size={24} />}
              <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
               <div className="bg-gray-100 p-2 rounded-lg"><Truck size={20} /></div>
               <span>Free delivery on orders &gt; ₹999</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
               <div className="bg-gray-100 p-2 rounded-lg"><Shield size={20} /></div>
               <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
