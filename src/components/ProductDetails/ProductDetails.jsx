import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartPlus, 
  faStar, 
  faSpinner, 
  faMinus, 
  faPlus,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { CartContext } from '../../context/CartContext';


// Helper Function: Format Price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(price);
};

export default function ProductDetails() {
  const location = useLocation();
  // State Management
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [relatedProductsError, setRelatedProductsError] = useState(null);
  
  const Navigate = useNavigate();
  
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  // handle buy now button
  function handleBuyNow() {
    Navigate('/CheckOut');
  }

  // Scroll to top when component mounts or route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // to scroll to top of the page when component mounts
  }, [location.pathname, id]);

  // Fetch Product Details with Error Handling
  async function getProductDetails(id) {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
      const product = response.data.data;
      setProductDetails(product);
      setSelectedImage(product.imageCover);
      await getRelatedProducts(product.category._id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Fetch Related Products with Error Handling
  async function getRelatedProducts(categoryId) {
    try {
      const response = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`
      );
      const filtered = response.data.data
        .filter(product => product.id !== id)
        .slice(0, 8);
      setRelatedProducts(filtered);
      setRelatedProductsError(null);
    } catch (error) {
      console.error('Error fetching related products:', error);
      setRelatedProductsError('Failed to load related products');
      toast.error('Failed to load related products');
      setRelatedProducts([]);
    }
  }

  // Add to Cart Handler with Loading State and Error Handling
  async function handleAddToCart() {
    if (addingToCart) return;

    const loadingToastId = toast.loading('Adding to cart...');
    try {
      setAddingToCart(true);
      const response = await addToCart(productDetails.id, quantity);
      
      if (response.data?.status === 'success') {
        toast.success('Product added to cart successfully', { id: loadingToastId });
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      toast.error(error.message || 'Error adding product to cart', { id: loadingToastId });
    } finally {
      setAddingToCart(false);
    }
  }

  // Initial Load Effect
  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  // SEO Effect
  useEffect(() => {
    if (productDetails) {
      document.title = `${productDetails.title} | Your Store Name`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', productDetails.description.slice(0, 160));
    }
    return () => {
      document.title = 'Your Store Name'; // Reset on unmount
    };
  }, [productDetails]);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-blue-600 animate-spin"
        />
      </div>
    );
  }

  // Error State
  if (error || !productDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-4xl text-red-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 text-center mb-4">
          {error || "Sorry, we couldn't find the product you're looking for."}
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section */}
        <div className="md:w-2/5">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={productDetails.title}
              className={`w-full h-[500px] object-cover hover:scale-105 transition-transform duration-300 
                ${imageLoading ? 'animate-pulse bg-gray-200' : ''}`}
              onLoad={() => setImageLoading(false)}
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div 
              onClick={() => setSelectedImage(productDetails.imageCover)}
              className={`cursor-pointer rounded-lg overflow-hidden
                ${selectedImage === productDetails.imageCover ? 'ring-2 ring-blue-500' : ''}`}
            >
              <img
                src={productDetails.imageCover}
                alt={`${productDetails.title} - cover`}
                className="w-full h-24 object-cover hover:opacity-75 transition-opacity"
              />
            </div>
            {productDetails.images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`cursor-pointer rounded-lg overflow-hidden
                  ${selectedImage === image ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img
                  src={image}
                  alt={`${productDetails.title} - ${index + 1}`}
                  className="w-full h-24 object-cover hover:opacity-75 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="md:w-3/5">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {productDetails.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                <FontAwesomeIcon icon={faStar} />
                <span className="ml-1">{productDetails.ratingsAverage}</span>
              </div>
              <span className="text-gray-500">
                ({productDetails.ratingsQuantity} reviews)
              </span>
            </div>

            <div className="text-2xl font-bold text-green-600 mb-4">
              {formatPrice(productDetails.price)}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Description:
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {productDetails.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Category:
              </h3>
              <span className="inline-block bg-gray-100 rounded-full px-4 py-1 text-sm font-semibold text-gray-700">
                {productDetails.category?.name}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg
                  transition-colors duration-300 flex items-center justify-center gap-2
                  ${addingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
                aria-label="Add to cart"
              >
                {addingToCart ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faCartPlus} />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button 
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 
                  py-3 px-6 rounded-lg transition-colors duration-300"
                aria-label="Buy now"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                to={`/ProductDetails/${product.id}`}
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-white font-semibold">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      <FontAwesomeIcon icon={faStar} className="text-sm" />
                      <span className="ml-1 text-sm">
                        {product.ratingsAverage}
                      </span>
                    </div>
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                      {product.category?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}