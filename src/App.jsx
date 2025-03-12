import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Notfound from './components/Notfound/Notfound'
import Brands from './components/Brands/Brands'
import Categories from './components/Categories/Categories'
import Products from './components/Products/Products'
import Cart from './components/cart/cart'
import Cart from './components/cart/cart';

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Wishlist from './components/Wishlist/Wishlist'
import UserContextProvider from './context/UserContext'
import ProtectedRoute from './components/protectedRoute/protectedRoute'
import ProductDetails from './components/ProductDetails/ProductDetails'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import CartContextProvider from './context/CartContext'
import  { Toaster } from 'react-hot-toast';
import CheckOut from './components/CheckOut/CheckOut'
import AllOrders from './components/AllOrders/AllOrders'
import PasswordReset from './components/PasswordReset/PasswordReset'
import { Helmet, HelmetProvider } from 'react-helmet-async';


const query = new QueryClient();




let router = createBrowserRouter([
  {
    path: "",
    element: <Layout/> , children: [
      {
        index: true,
        element: <ProtectedRoute><Home/></ProtectedRoute>
      },
      {
        path: "Brands",
        element: <ProtectedRoute><Brands/></ProtectedRoute>
      },{
        path: "ProductDetails/:id",
        element: <ProtectedRoute><ProductDetails/></ProtectedRoute>
        
      },
      {
        path: "Categories",
        element: <ProtectedRoute><Categories/></ProtectedRoute>
      },
      {
        path: "CheckOut",
        element: <ProtectedRoute><CheckOut/></ProtectedRoute>
      },
      {
        path: "Products",
        element: <ProtectedRoute><Products/></ProtectedRoute>
      },
      {
        path: "AllOrders",
        element: <ProtectedRoute><AllOrders/></ProtectedRoute>
      },
      {
        path: "cart",
        element: <ProtectedRoute><Cart/></ProtectedRoute>
      },
      {
        path: "Login",
        element:<Login/>
      },
      {
        path: "PasswordReset",
        element:<PasswordReset/>
      },
      {
        path: "Register",
        element:<Register/>
      },
      {
        path: "Wishlist",
        element:<ProtectedRoute><Wishlist/></ProtectedRoute>
      },
      
      {
        path: "*",
        element: <Notfound/>
      }

      // Add more routes here...

    ]
  
  }
])

function App() {
  

  return (
    <>
    <CartContextProvider>
      <QueryClientProvider client={query}> 
        <UserContextProvider>
        <HelmetProvider>
          <RouterProvider router={router}></RouterProvider>
          <Toaster />
        </HelmetProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </CartContextProvider>
    </>
  )
}

export default App



// import { lazy, Suspense } from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
// import { Toaster } from 'react-hot-toast';

// // Import Context Providers
// import CartContextProvider from './context/CartContext'
// import UserContextProvider from './context/UserContext'

// // Regular imports for frequently used components
// import Layout from './components/Layout/Layout'
// import Home from './components/Home/Home'
// import Login from './components/Login/Login'
// import Register from './components/Register/Register'
// import ProtectedRoute from './components/protectedRoute/protectedRoute'
// import Cart from './components/cart/cart'

// // Lazy loaded components
// const Brands = lazy(() => import('./components/Brands/Brands'))
// const Categories = lazy(() => import('./components/Categories/Categories'))
// const Products = lazy(() => import('./components/Products/Products'))
// const Wishlist = lazy(() => import('./components/Wishlist/Wishlist'))
// const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails'))
// const CheckOut = lazy(() => import('./components/CheckOut/CheckOut'))
// const AllOrders = lazy(() => import('./components/AllOrders/AllOrders'))
// const Notfound = lazy(() => import('./components/Notfound/Notfound'))

// // Rest of your code remains the same...

// const query = new QueryClient();

// let router = createBrowserRouter([
//   {
//     path: "",
//     element: <Layout/>,
//     children: [
//       {
//         index: true,
//         element: <ProtectedRoute><Home/></ProtectedRoute>
//       },
//       {
//         path: "Brands",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><Brands/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "ProductDetails/:id",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><ProductDetails/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "Categories",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><Categories/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "CheckOut",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><CheckOut/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "Products",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><Products/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "AllOrders",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><AllOrders/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "cart",
//         element: <ProtectedRoute><Cart/></ProtectedRoute>
//       },
//       {
//         path: "Login",
//         element: <Login/>
//       },
//       {
//         path: "Register",
//         element: <Register/>
//       },
//       {
//         path: "Wishlist",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <ProtectedRoute><Wishlist/></ProtectedRoute>
//           </Suspense>
//         )
//       },
//       {
//         path: "*",
//         element: (
//           <Suspense fallback={<div>Loading...</div>}>
//             <Notfound/>
//           </Suspense>
//         )
//       }
//     ]
//   }
// ])

// function App() {
//   return (
//     <>
//       <CartContextProvider>
//         <QueryClientProvider client={query}> 
//           <UserContextProvider>
//             <RouterProvider router={router}></RouterProvider>
//             <Toaster />
//           </UserContextProvider>
//         </QueryClientProvider>
//       </CartContextProvider>
//     </>
//   )
// }

// export default App







