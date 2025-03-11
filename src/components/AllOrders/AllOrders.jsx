import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';


export default function AllOrders() {
  const { UserId } = useContext(UserContext);
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getMyOrders(userId) {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
      );
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (UserId) {
      getMyOrders(UserId);
    }
  }, [UserId]);

  if (!UserId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Please login to view your orders</h2>
        <Link 
          to="/" 
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-4">{error}</p>
          <Link 
            to="/" 
            className="text-green-600 hover:text-green-700 underline"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
      
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-green-600">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">{order.totalOrderPrice} EGP </p>
                  </div>
                </div>
              </div>

              <Helmet>
                <title>Fresh Cart | My Orders</title>
                <meta name="description" content="View all your orders and their status" />
                <link rel="canonical" href="/all-orders" />
              </Helmet>

              {/* Order Items */}
              <div className="space-y-4">
                {order.cartItems.map((item) => (
                  <div 
                    key={item._id}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img 
                      src={item.product.imageCover} 
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">
                        {item.product.title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Price per unit</p>
                          <p className="font-semibold">${item.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-semibold">{item.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold">
                            ${(item.price * item.count).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Shipping Address:</p>
                  <p className="font-semibold">
                    {order.shippingAddress?.details}, 
                    {order.shippingAddress?.city}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No orders found</p>
            <Link 
              to="/" 
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
