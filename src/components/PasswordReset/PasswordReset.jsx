import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';

export default function PasswordReset() {
  const navigate = useNavigate();
  
  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });


  // Handle password reset
  async function handlePasswordReset(values, { setSubmitting }) {
    const loadingToast = toast.loading('Sending reset instructions...');
    
    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          email: values.email
        }
      );
      
      console.log(response);
  
      // Check if the reset email was sent successfully
      if (response.data.statusMsg === "success") {
        // Dismiss the loading toast and show success message
        toast.success('Reset instructions sent successfully! Check your email', {
          id: loadingToast,
          duration: 3000
        });
  
        // Redirect to verification code page
        navigate('/Login');
      }
  
    } catch (error) {
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      
      // Dismiss loading toast and show error
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 3000
      });
  
      console.error('Password reset error:', error);
    } finally {
      setSubmitting(false);
    }
  }
  

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: handlePasswordReset,
  });

  // Auto-focus email input
  useEffect(() => {
    document.getElementById('email')?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Fresh Cart | Reset Password</title>
        <meta name="description" content="Reset your account password" />
        <link rel="canonical" href="/password-reset" />
        </Helmet>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  {...formik.getFieldProps('email')}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  (formik.isSubmitting || !formik.isValid) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {formik.isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-green-600 hover:text-green-500"
                >
                  Back to Login
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
