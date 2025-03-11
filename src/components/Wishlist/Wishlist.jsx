import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationCircle, 
  faRedo, 
  faHeart as solidHeart, 
  faCartPlus,
  faHeartBroken
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

export default function Wishlist() {
  const { addToCart } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(null);

  // Initialize likedProducts from localStorage
  const [likedProducts, setLikedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('likedProducts');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Error loading liked products:', error);
      return new Set();
    }
  });

  // Fetch all products to get details of liked products
  const { data: allProducts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Filter only liked products
  const likedProductsDetails = allProducts.filter(product => 
    likedProducts.has(product._id)
  );

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      newLiked.delete(productId);
      localStorage.setItem('likedProducts', JSON.stringify([...newLiked]));
      return newLiked;
    });
    toast.success('Removed from wishlist');
  };

  // Add to cart handler
  async function handleAddToCart(productId) {
    setIsAddingToCart(productId);
    try {
      const res = await addToCart(productId);
      if (res.data?.status === 'success') {
        toast.success('Product added successfully to the cart');
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      toast.error('Error adding product to the cart' , error );
    } finally {
      setIsAddingToCart(null);
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl max-w-lg mx-auto my-8 border border-red-100">
        <div className="mb-4 text-red-500">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-3">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{error?.message || 'Failed to load wishlist'}</p>
        <button 
          onClick={() => refetch()} 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          <FontAwesomeIcon icon={faRedo} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Empty Wishlist State
  if (likedProductsDetails.length === 0) {
    return (
      <div className="text-center py-16">
        <Helmet>
        <title>Fresh Cart | Wishlist</title>
        <meta name="description" content="Your saved items for later" />
        <link rel="canonical" href="/wishlist" />
      </Helmet>
        <FontAwesomeIcon icon={faHeartBroken} className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Start adding products you love!</p>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Success State
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedProductsDetails.map((product) => (
          <div key={product._id} className="bg-white  rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group">
            {/* Remove from Wishlist Button */}
            <button 
              onClick={() => removeFromWishlist(product._id)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            >
              <FontAwesomeIcon 
                icon={solidHeart}
                className="text-xl text-red-500"
              />
            </button>

            {/* Product Link */}
            <Link to={`/product/${product._id}`}>
            <div className="w-full mb-4">
                <img 
                  src={product.imageCover} 
                  alt={product.title}
                  className="w-full object-cover rounded-t-xl"
                  loading="lazy"
                />
              </div>

              <div className="p-3 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-green-600 font-bold text-lg mb-2">
                  Price: {product.price} EGP 
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Category: {product.category?.name || 'Uncategorized'}
                </p>
                <div className="text-amber-500 text-sm mb-4">
                  Rating: {product.ratingsAverage || 0} ⭐
                  <span className="text-gray-500">
                    ({product.ratingsQuantity || 0} reviews)
                  </span>
                </div>
              </div>
            </Link>

            {/* Add to Cart Button */}
            <button 
                onClick={() => handleAddToCart(product._id)}
                disabled={isAddingToCart === product._id}
                className={`
                    w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    
                    /* Desktop Hover Animation */
                    md:opacity-0 md:group-hover:opacity-100 
                    md:translate-y-4 md:group-hover:translate-y-0 
                    
                    /* Mobile Always Visible */
                    opacity-100 translate-y-0
                    
                    /* Disabled State */
                    disabled:bg-blue-400 disabled:cursor-not-allowed
                `}
            >
                <FontAwesomeIcon 
                    icon={faCartPlus} 
                    className="text-lg"
                />
                <span className="font-medium">
                    {isAddingToCart === product._id ? 'Adding...' : 'Add to Cart'}
                </span>
            </button>

          </div>
          
        ))}
      </div>
      
    </div>
  );
}
