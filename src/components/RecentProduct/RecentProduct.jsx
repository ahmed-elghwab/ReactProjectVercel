import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationCircle, 
  faRedo, 
  faHeart as solidHeart, 
  faCartPlus 
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function RecentProduct() {
  const { addToCart } = useContext(CartContext);

  // Initialize likedProducts from localStorage with error handling
  const [likedProducts, setLikedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('likedProducts');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Error loading liked products:', error);
      return new Set();
    }
  });

  // Save to localStorage whenever likedProducts changes
  useEffect(() => {
    try {
      localStorage.setItem('likedProducts', JSON.stringify([...likedProducts]));
    } catch (error) {
      console.error('Error saving liked products:', error);
    }
  }, [likedProducts]);

  const queryClient = useQueryClient();

  // Fetch Products Query with caching configuration
  const { 
    data: products = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
      return response.data.data;
    },
    staleTime: 1* 60 * 1000, // 1 minutes before data is considered stale
    cacheTime: 5 * 60 * 1000, // 5 minutes before unused data is garbage collected
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 2, // Retry failed requests twice
    onError: (err) => {
      console.error('Failed to fetch products:', err);
    }
  });

  // Add to Cart Mutation (Commented Out)
  /*
  const addToCartMutation = useMutation({
    mutationFn: async (productId) => {
      return axios.post('https://ecommerce.routemisr.com/api/v1/cart', 
        { productId },
        { headers: { 'token': localStorage.getItem('userToken') }}
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      console.log('Product added to cart successfully', data);
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        console.error('User not authenticated');
      } else {
        console.error('Failed to add product to cart');
      }
    }
  });
  */

  // Add to Cart Handler with Loading State and Error Handling
  const [addingToCart, setAddingToCart] = useState(false);

  async function addProductToCart(productId) {
    if (addingToCart) return;

    setAddingToCart(true);
    try {
      const res = await addToCart(productId);
      if (res.data?.status === 'success') {
        toast.success('Product added successfully to the cart');
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding product to the cart');
    } finally {
      setAddingToCart(false);
    }
  }

  // Like Toggle Handler
  const toggleLike = (productId) => {
    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading products...</p>
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
        <p className="text-gray-600 mb-6">{error.message || 'Failed to load products'}</p>
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

  // Success State
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ease-out duration-800 hover:-translate-y-1 relative group flex flex-col">
            {/* Like Button */}
            <button 
              onClick={() => toggleLike(product.id)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              aria-label={likedProducts.has(product._id) ? 'Unlike product' : 'Like product'}
            >
              <FontAwesomeIcon 
                icon={likedProducts.has(product.id) ? solidHeart : regularHeart}
                className={`text-xl ${likedProducts.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
              />
            </button>

            {/* Product Link */}
            <Link to={`/ProductDetails/${product._id}`} className="group relative block">
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
              onClick={() => addProductToCart(product.id)}
              disabled={addingToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg 
                      flex items-center justify-center gap-2 mt-auto
                      opacity-0 group-hover:opacity-100 
                      translate-y-4 group-hover:translate-y-0 
                      transition-all duration-800 ease-out
                      disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faCartPlus} />
              <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}