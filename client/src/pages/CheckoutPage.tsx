import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAddressesQuery, useAddAddressMutation, useCreateOrderMutation, useVerifyPaymentMutation } from '../features/checkout/checkoutApi';
import { useGetCartQuery } from '../features/cart/cartApi';
import { Loader2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { data: cartData } = useGetCartQuery();
  const { data: addressData, isLoading: isLoadingAddresses } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'India' });
  
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(newAddress).unwrap();
      setShowAddressForm(false);
      setNewAddress({ street: '', city: '', state: '', zip: '', country: 'India' });
    } catch (err) {
      console.error('Failed to add address', err);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddressId || !user) return;

    try {
      const orderData = await createOrder({ addressId: selectedAddressId }).unwrap();
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PlantStore",
        description: "Purchase from PlantStore",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
           try {
             await verifyPayment({
               razorpayOrderId: response.razorpay_order_id,
               razorpayPaymentId: response.razorpay_payment_id,
               signature: response.razorpay_signature
             }).unwrap();
             navigate('/orders', { replace: true });
           } catch (err) {
             alert('Payment verification failed');
           }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#16a34a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order creation failed', err);
      alert('Something went wrong initiating payment');
    }
  };

  if (isLoadingAddresses) return <div className="p-10 text-center"><Loader2 className="animate-spin inline" /></div>;

  const addresses = addressData?.addresses || [];
  const cartItems = cartData?.cart?.items || [];
  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);

  if (cartItems.length === 0) return <div className="p-10 text-center">Your cart is empty</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Select Shipping Address</h2>
        <div className="space-y-4 mb-6">
          {addresses.map(addr => (
            <div 
              key={addr.id} 
              onClick={() => setSelectedAddressId(addr.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-200 hover:border-primary-300'}`}
            >
              <div className="font-semibold">{addr.street}</div>
              <div className="text-gray-600">{addr.city}, {addr.state} - {addr.zip}</div>
            </div>
          ))}
        </div>

        {!showAddressForm ? (
          <button 
            onClick={() => setShowAddressForm(true)}
            className="flex items-center text-primary-600 font-medium hover:text-primary-700"
          >
            <Plus size={20} className="mr-1" /> Add New Address
          </button>
        ) : (
          <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-xl space-y-4">
             <input placeholder="Street" required className="w-full p-2 border rounded" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
             <div className="grid grid-cols-2 gap-4">
               <input placeholder="City" required className="w-full p-2 border rounded" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
               <input placeholder="State" required className="w-full p-2 border rounded" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <input placeholder="Zip Code" required className="w-full p-2 border rounded" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
               <input placeholder="Country" required className="w-full p-2 border rounded" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
             </div>
             <div className="flex justify-end space-x-2">
               <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
               <button type="submit" disabled={isAddingAddress} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">Save</button>
             </div>
          </form>
        )}
      </div>

      <div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span className="font-semibold">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handlePayment}
            disabled={!selectedAddressId || isCreatingOrder}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCreatingOrder ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
          </button>
          {!selectedAddressId && <p className="text-sm text-red-500 mt-2 text-center">Please select an address to proceed</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
