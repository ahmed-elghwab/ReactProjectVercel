import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCreditCard, faLocationDot, faPhone, faClipboardList } from '@fortawesome/free-solid-svg-icons';

import { Helmet } from 'react-helmet-async';



export default function CheckOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const { cartId , Payment } = useContext(CartContext);
  const Navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object({
    details: Yup.string()
      .required("Shipping details are required")
      .min(10, "Please provide more detailed shipping information")
      .max(200, "Details too long"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/, "Please enter a valid Egyptian phone number"),
    city: Yup.string()
      .required("City is required")
      .min(3, "City name must be at least 3 characters")
      .matches(/^[a-zA-Z\s]*$/, "City name can only contain letters")
  });

  // Handle Checkout
  async function handleCheckOut(values) {
    if (!cartId) { // Check if cartId exists
        toast.error("Please add products to cart first");
        return;
    }

    if (!paymentMethod) { // Check if payment method is selected
        toast.error("Please select a payment method");
        return;
    }

    const loadingToast = toast.loading('Processing your payment...');
    setIsLoading(true);

    try {
        const response = await Payment(values, paymentMethod);
        
        if (response.data?.status === 'success') {
            toast.success("Order processed successfully", { id: loadingToast });
            
            // Handle different responses based on payment method
            if (paymentMethod === 'online') {
                window.location.href = response.data.session.url;
            } else {
                // Redirect to success page or show confirmation for cash payment
                Navigate('/AllOrders');
            }
        } else {
            throw new Error("Order processing failed");
        }
    } catch (error) {
        toast.error(error.message || "Something went wrong", { id: loadingToast });
        console.error("Checkout error:", error);
    } finally {
        setIsLoading(false);
    }
}


  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: ""
    },
    validationSchema,
    onSubmit: handleCheckOut
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Fresh Cart | Checkout</title>
          <meta name="description" content="Complete your purchase securely" />
          <link rel="canonical" href="/checkout" />
        </Helmet>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Checkout
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in your shipping details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Shipping Details */}
          <div>
            <label htmlFor="details" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              Shipping Details
            </label>
            <textarea
              id="details"
              name="details"
              rows="3"
              className={`appearance-none block w-full px-3 py-2 border ${
                formik.touched.details && formik.errors.details 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="Enter your complete shipping address"
              {...formik.getFieldProps('details')}
            />
            {formik.touched.details && formik.errors.details && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.details}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`appearance-none block w-full px-3 py-2 border ${
                formik.touched.phone && formik.errors.phone 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="Enter your phone number"
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
              City
            </label>
            <input
              type="text"
              name='city'
              id="city"
              className={`appearance-none block w-full px-3 py-2 border ${
                formik.touched.city && formik.errors.city 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="Enter your city"
              {...formik.getFieldProps('city')}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.city}</p>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                  Select Payment Method
              </label>
              <div className="space-y-2">
                  <div className="flex items-center">
                      <input
                          id="cash"
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-green-500"
                      />
                      <label htmlFor="cash" className="ml-2 block text-sm text-gray-900">
                          Cash on Delivery
                      </label>
                  </div>
                  <div className="flex items-center">
                      <input
                          id="online"
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-green-500"
                      />
                      <label htmlFor="online" className="ml-2 block text-sm text-gray-900">
                          Online Payment (Credit Card)
                      </label>
                  </div>
              </div>
              {!paymentMethod && formik.touched.details && (
                  <p className="mt-2 text-sm text-red-600">
                      Please select a payment method
                  </p>
              )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isLoading}
              className={`flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                (!formik.isValid || !formik.dirty || isLoading) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Cart Link */}
        <div className="mt-6 text-center">
          <Link
            to="/cart"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            ← Back to Cart
          </Link>
        </div>
        
      </div>
    </div>
  );
}
