import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationCircle, 
  faRedo
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';




export default function Categories() {
  // Fetch Categories Query
  const { 
    data: categories = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (err) => {
      console.error("Failed to fetch categories:", err);
    }
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading categories...</p>
          <button 
                      onClick={() => refetch()} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    >
                      <FontAwesomeIcon icon={faRedo} />
                      <span>Retry</span>
                    </button>
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
        <p className="text-gray-600 mb-6">{error.message || 'Failed to load categories'}</p>
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
      <Helmet>
        <title>Fresh Cart | Categories</title>
        <meta name="description" content="Browse products by category" />
        <link rel="canonical" href="/categories" />
      </Helmet>
      <h2 className="text-2xl font-bold text-center my-8">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ease-out duration-800 hover:-translate-y-1 relative group flex flex-col"
          >
            <div className="w-full h-48 mb-4">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover rounded-t-xl"
                loading="lazy"
              />
            </div>

            <div className="p-3 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {category.name}
              </h3>
              
              {category.slug && (
                <p className="text-gray-600 text-sm mb-2 text-center">
                  {category.slug}
                </p>
              )}
              
              {category.updatedAt && (
                <div className="text-gray-500 text-sm mb-4 text-center">
                  Last updated: {new Date(category.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
