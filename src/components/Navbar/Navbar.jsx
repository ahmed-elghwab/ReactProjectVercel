import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/freshcart-logo.svg'
import { UserContext } from '../../context/UserContext';
import { CartContext } from '../../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { UserLogin, setUserLogin } = useContext(UserContext);
  const { cartCount, setCartCount, getCartItems } = useContext(CartContext);

  const isAuthPage = () => {
    return location.pathname === '/Login' || location.pathname === '/Register';
  };

  useEffect(() => {
    if (UserLogin) {
      getCartItems();
    }
  }, [UserLogin]);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    setCartCount(0);
    navigate('/Login');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-main-light dark:bg-gray-900 fixed w-full z-20 top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          
          <Link to={''} className="flex items-center space-x-3 rtl:space-x-reverse">
            <img className="h-8" alt="FreshCart Logo" src={logo} />
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* Cart Link - Always visible */}
            {UserLogin !== null && (
              <div className="mr-4 relative">
                <NavLink to="Cart" className="flex items-center text-slate-900">
                  <span className="mr-1">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}

            {/* Login/Register/Logout Links */}
            <ul className='flex justify-around m-0'>
              {UserLogin == null ? (
                <>
                  <li className='text-lg mx-2 text-slate-900'>
                    <NavLink to={'Login'}>Login</NavLink>
                  </li>
                  <li className='text-lg mx-2 text-slate-900'>
                    <NavLink to={'Register'}>Register</NavLink>
                  </li>
                </>
              ) : (
                <li className='text-lg mx-2 text-slate-900'>
                  <span onClick={handleLogout} className='cursor-pointer'>Logout</span>
                </li>
              )}
            </ul>

            {/* Mobile Menu Button - Only show if not on auth pages */}
            {!isAuthPage() && (
              <button
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Menu Items */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isMenuOpen ? 'block' : 'hidden'
            }`}
            id="navbar-sticky"
          >
            <ul className="bg-main-light flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {UserLogin !== null && (
                <>
                  <li className="text-lg mx-2 text-slate-500 font-normal">
                    <NavLink to="" onClick={toggleMenu}>Home</NavLink>
                  </li>
                  <li className="text-lg mx-2 text-slate-500 font-normal">
                    <NavLink to="Wishlist" onClick={toggleMenu}>Wish list</NavLink>
                  </li>
                  <li className="text-lg mx-2 text-slate-500 font-normal">
                    <NavLink to="Products" onClick={toggleMenu}>Products</NavLink>
                  </li>
                  <li className="text-lg mx-2 text-slate-500 font-normal">
                    <NavLink to="Categories" onClick={toggleMenu}>Categories</NavLink>
                  </li>
                  <li className="text-lg mx-2 text-slate-500 font-normal">
                    <NavLink to="Brands" onClick={toggleMenu}>Brands</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
