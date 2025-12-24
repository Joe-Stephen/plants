import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Leaf } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { useGetCartQuery } from '../features/cart/cartApi';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: cartData } = useGetCartQuery(undefined, { skip: !user }); // Only fetch if logged in
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = cartData?.cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
                 <Leaf size={24} />
              </div>
              <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900 md:text-gray-800'}`}>
                Plant<span className="text-primary-600">Store</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Shop</Link>
              
              <div className="flex items-center space-x-4 border-l pl-8 border-gray-200">
                <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors p-1">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/orders" className="text-gray-600 hover:text-primary-600 font-medium">My Orders</Link>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Logout">
                      <LogOut size={22} />
                    </button>
                    {user.role === 'ADMIN' && (
                       <Link to="/admin/orders" className="bg-gray-900 text-white px-3 py-1 rounded text-xs">Admin</Link>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                    <Link to="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-lg shadow-primary-600/20">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top-5">
            <Link to="/" className="text-lg font-medium text-gray-800">Home</Link>
            <Link to="/shop" className="text-lg font-medium text-gray-800">Shop</Link>
            <Link to="/cart" className="text-lg font-medium text-gray-800 flex items-center justify-between">
              Cart 
              {cartItemCount > 0 && <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-sm font-bold">{cartItemCount}</span>}
            </Link>
            <div className="border-t pt-4">
               {user ? (
                 <>
                   <div className="font-bold text-gray-500 mb-2">Hi, {user.name}</div>
                   <Link to="/orders" className="block py-2 text-gray-700">My Orders</Link>
                   {user.role === 'ADMIN' && <Link to="/admin/orders" className="block py-2 text-primary-600">Admin Dashboard</Link>}
                   <button onClick={handleLogout} className="text-red-500 mt-2 flex items-center font-medium">
                     <LogOut size={18} className="mr-2" /> Logout
                   </button>
                 </>
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                   <Link to="/login" className="text-center py-2 border rounded-lg hover:bg-gray-50">Login</Link>
                   <Link to="/signup" className="text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Sign Up</Link>
                 </div>
               )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 md:pt-28">
        {/* Adds padding top to account for fixed header */}
        <div className={location.pathname === '/' ? '' : 'container mx-auto px-6 py-6'}>
           <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                   <Leaf size={20} />
                </div>
                <span className="text-2xl font-bold">PlantStore</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Bringing the beauty of nature into your modern living space with our curated plant collection.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Shop</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/shop" className="hover:text-primary-400 transition-colors">All Plants</Link></li>
                <li><Link to="/shop?cat=indoor" className="hover:text-primary-400 transition-colors">Indoor Plants</Link></li>
                <li><Link to="/shop?cat=succulents" className="hover:text-primary-400 transition-colors">Succulents</Link></li>
                <li><Link to="/shop?cat=pots" className="hover:text-primary-400 transition-colors">Pots & Planters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-primary-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Plant Care Guide</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Stay Connected</h4>
              <p className="text-gray-400 mb-4">Subscribe for plant care tips and exclusive offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-gray-800 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-full border border-gray-700" 
                />
                <button className="bg-primary-600 px-4 py-3 rounded-r-lg font-medium hover:bg-primary-700">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <div>&copy; {new Date().getFullYear()} PlantStore. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
    </div>
  );
};

export default MainLayout;
