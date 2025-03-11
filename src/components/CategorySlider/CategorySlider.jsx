import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getCategories() {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      if (response.data.data.length === 0) {
        setError('No categories found');
      } else {
        setCategories(response.data.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px] p-4">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">Error Loading Categories</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={getCategories}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">No Categories Found</h2>
          <p>Please check back later.</p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-[-8px]">
        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category._id} className="px-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <div className="relative w-full pt-[100%]">
                  <img 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x200?text=Not+Found';
                    }}
                  />
                </div>
                <div className="p-3 bg-white">
                  <h3 className="text-center text-gray-800 font-medium truncate">
                    {category.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
