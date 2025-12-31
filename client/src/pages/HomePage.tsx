import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productApi';
import { useGetAllCategoriesQuery } from '../features/categories/categoryApi';
import ProductCard from '../components/ProductCard';
import { Loader2, ArrowRight, Truck, ShieldCheck, Leaf } from 'lucide-react';

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800', // Indoor
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800', // Succulents
  'https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?auto=format&fit=crop&q=80&w=800', // Foliage
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', // Large plants
  'https://images.unsplash.com/photo-1598556776374-32328ba90a29?auto=format&fit=crop&q=80&w=800', // Hanging
];

const HomePage = () => {
  const { data, isLoading } = useGetProductsQuery('sort=best_selling&limit=4');
  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();

  const products = data?.products?.slice(0, 4) || [];
  const categories = categoryData?.categories || [];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Hero Plants"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-md tracking-tight leading-tight">
            Bring Nature <br className="hidden md:block" /> into Your Home
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light drop-shadow text-gray-100">
            Discover our curated collection of vibrant, easy-to-care-for plants
            that transform your living space.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-primary-600/30"
          >
            Shop Collection <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: 'Free Shipping',
              desc: 'On all orders over ₹999',
            },
            {
              icon: ShieldCheck,
              title: 'Secure Payment',
              desc: '100% secure payment gateway',
            },
            {
              icon: Leaf,
              title: 'Quality Guarantee',
              desc: 'Healthy plants delivered fresh',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex text-gray-600 hover:text-primary-600 font-medium items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {isCategoriesLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const bgImage = CATEGORY_IMAGES[index % CATEGORY_IMAGES.length];
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={bgImage}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      {category.description ||
                        `Explore our ${category.name} collection`}
                    </p>
                    <span className="text-white font-medium flex items-center opacity-90 group-hover:opacity-100">
                      Shop Collection{' '}
                      <ArrowRight
                        size={16}
                        className="ml-2 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">
            Best Sellers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trending Plants
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-primary-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
