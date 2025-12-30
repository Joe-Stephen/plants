import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from '../features/cart/cartApi';
import { Loader2, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { data, isLoading, error } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  // Not logged in or error often means 401, but handled globally?
  // For now simple error check.
  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">
          You need to be logged in to view your cart.
        </p>
        <Link
          to="/login"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Login
        </Link>
      </div>
    );
  }

  const cartItems = data?.cart?.items || [];
  const total = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/shop" className="text-primary-600 hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="p-6 border-b border-gray-100 flex items-center gap-6"
          >
            <img
              src={
                item.product.images.find((img) => img.is_primary)?.url ||
                'https://via.placeholder.com/100'
              }
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-lg bg-gray-100"
            />

            <div className="flex-grow">
              <Link
                to={`/shop/${item.product.id}`}
                className="font-bold text-lg hover:text-primary-600"
              >
                {item.product.name}
              </Link>
              <div className="text-primary-700 font-semibold mt-1">
                ₹{item.product.price}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateItem({
                    id: item.id,
                    quantity: Math.max(1, item.quantity - 1),
                  })
                }
                className="p-1 text-gray-400 hover:text-gray-600 border rounded"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateItem({
                    id: item.id,
                    quantity: Math.min(item.product.stock, item.quantity + 1),
                  })
                }
                className="p-1 text-gray-400 hover:text-gray-600 border rounded"
                disabled={item.quantity >= item.product.stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="font-bold text-gray-800 w-24 text-right">
              ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-600 p-2"
              title="Remove Item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="text-gray-600">
          <Link to="/shop" className="hover:underline">
            &larr; Continue Shopping
          </Link>
        </div>

        <div className="text-right w-full md:w-auto">
          <div className="flex justify-between items-center gap-12 text-xl font-bold mb-6">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors w-full md:w-auto"
          >
            Proceed to Checkout <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
