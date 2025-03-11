import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Programmatic routing
import * as Yup from "yup";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-hot-toast";
import { Helmet } from 'react-helmet-async';



export default function Login() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLogin } = useContext(UserContext);

  // Handle login function to call API
  async function handleLogin(formValues) {
    setIsLoading(true);
    try {
      console.log("Form Values:", formValues); // Log the request body
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        formValues
      );
      console.log("Response Data:", data); // Log the server response

      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        setUserLogin(data.token);
        toast.success(`Welcome ${data.user.name}`, {
          duration: 3000,
          position: 'top-center',
        });
        console.log("Login successful. Redirecting to Home...");
        navigate("/"); // Navigate to the Home page
      }
    } catch (error) {
      if (error.response) {
        setApiError(error.response.data.message || "Invalid credentials");
        console.error("Server Error:", error.response.data.message);
      } else if (error.request) {
        setApiError("No response from server. Please try again later.");
        console.error("No response from server:", error.request);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
        console.error("Error:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character"
      ),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  // Automatically focus on the email field
  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  return ( <>
      {/*  react helmet async for seo  */}
      <Helmet>
        <title>Fresh Cart | Login</title>
        <meta name="description" content="Login to your Fresh Cart account" />
        <link rel="canonical" href="/login" />
      </Helmet>
      


    <div className="py-6 max-w-2xl mx-auto">
      {/* API Error */}
      {apiError && (
        <div
          className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">{apiError}</span>
        </div>
      )}

      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-green-700">Login Now</h1>

      {/* Form */}
      <form
        className="py-6 max-w-2xl mx-auto"
        autoComplete="off"
        onSubmit={formik.handleSubmit} // Corrected here
      >
        {/* Email Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter Your Email
          </label>
        </div>
        {/* Email Validation Error */}
        {formik.touched.email && formik.errors.email && (
          <div
            className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{formik.errors.email}</span>
          </div>
        )}

        {/* Password Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter Your Password
          </label>
        </div>
        {/* Password Validation Error */}
        {formik.touched.password && formik.errors.password && (
          <div
            className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">{formik.errors.password}</span>
          </div>
        )}

        {/* Submit Button and Links Section */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  {/* Submit Button - Keeping original */}
  <button
    type="submit"
    disabled={!(formik.isValid && formik.dirty) || isLoading}
    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-busy={isLoading}
  >
    {isLoading ? (
      <i
        className="fas fa-spinner fa-spin"
        aria-hidden="true"
        role="status"
      />
    ) : (
      "Login"
    )}
  </button>

  {/* Links Container */}
  <div className="flex flex-col sm:flex-row items-center gap-4">
    {/* Register Link - Enhanced */}
    <div className="relative group">
      <Link
        to="/register"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-300"
      >
        <i className="fas fa-user-plus text-green-700"></i>
        <span>
          Don't have an account yet?{" "}
          <span className="font-semibold text-green-700 hover:text-green-800 underline-offset-2 hover:underline">
            Register now
          </span>
        </span>
      </Link>
    </div>

    {/* Divider */}
    <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

    {/* Forgot Password Link - Enhanced */}
    <div className="relative group">
      <Link
        to="/PasswordReset"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-300"
        onClick={(e) => {
          if (!formik.values.email) {
            e.preventDefault();
            toast.error('Please enter your email first', {
              duration: 3000,
              position: 'top-center',
            });
            document.getElementById('email').focus();
          }
        }}
      >
        <i className="fas fa-key text-green-700"></i>
        <span>
          Forgot Your Password?{" "}
          <span className="font-semibold text-green-700 hover:text-green-800 underline-offset-2 hover:underline">
            Reset Now
          </span>
        </span>
      </Link>
    </div>
  </div>
</div>

      </form>
    </div>
    </>);
}