import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Cart() {
    const {
        getCartItems,
        cartItems,
        loading,
        updateCartQuantity,
        removeFromCart,
        totalCartPrice,
        clearCart,
    } = useContext(CartContext);

    const [isDeleting, setIsDeleting] = useState(null);
    const [isUpdating, setIsUpdating] = useState(null);

    useEffect(() => {
        getCartItems();
    }, []);

    const handleRemoveItem = async (productId) => {
        setIsDeleting(productId);
        try {
            const response = await removeFromCart(productId);
            if (response?.data?.status === 'success') {
                await getCartItems();
                toast.success('Item removed from cart');
            }
        } catch (error) {
            toast.error('Failed to remove item');
            console.error('Error removing item:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleUpdateQuantity = async (productId, count) => {
        if (count < 1) return;
        setIsUpdating(productId);
        try {
            const response = await updateCartQuantity(productId, count);
            if (response?.data?.status === 'success') {
                toast.success('Quantity updated');
            }
        } catch (error) {
            toast.error('Failed to update quantity');
            console.error('Error updating quantity:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await clearCart();
            if (response.data.message === 'success') {
                toast.success('Cart cleared successfully');
                await getCartItems();
            } else {
                toast.error('Failed to clear cart');
            }
        } catch (error) {
            toast.error('Failed to clear cart');
            console.error('Error clearing cart:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                <p className="text-gray-600">
                    Start shopping to add items to your cart 🛒{' '}
                    <Link to={'/Products'}>
                        <span className="text-blue-500">Shop Now</span>
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                    <title>Fresh Cart | Shopping Cart</title>
                    <meta name="description" content="Review and checkout your selected items" />
                    <link rel="canonical" href="/cart" />
                </Helmet>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Shopping Cart 🛒</h1>
                <button
                    onClick={handleClearCart}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Clear Cart 🗑️
                </button>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {cartItems.map((item) => (
                    <div key={item.product.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex gap-4">
                            <img
                                src={item.product.imageCover}
                                className="w-24 h-24 object-cover rounded"
                                alt={item.product.title}
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">{item.product.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product.id, item.count - 1)}
                                        disabled={item.count <= 1 || isUpdating === item.product.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={item.count}
                                        readOnly
                                        className="w-16 text-center border rounded-lg"
                                    />
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product.id, item.count + 1)}
                                        disabled={isUpdating === item.product.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm">
                                        <p className="text-gray-500">Unit: {item.price} EGP</p>
                                        <p className="font-bold">Total: {(item.price * item.count).toFixed(2)} EGP</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.product.id)}
                                        disabled={isDeleting === item.product.id}
                                        className="text-red-600 text-sm font-medium"
                                    >
                                        {isDeleting === item.product.id ? "Removing..." : "Remove"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block relative overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Image</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Qty
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr
                                key={item.product.id}
                                className="bg-white border-b hover:bg-gray-50"
                            >
                                <td className="p-4">
                                    <img
                                        src={item.product.imageCover}
                                        className="w-16 md:w-32 max-w-full max-h-full"
                                        alt={item.product.title}
                                    />
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {item.product.title}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(item.product.id, item.count - 1)
                                            }
                                            disabled={item.count <= 1 || isUpdating === item.product.id}
                                            className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Decrease quantity</span>
                                            <svg
                                                className="w-3 h-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 18 2"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M1 1h16"
                                                />
                                            </svg>
                                        </button>
                                        <div>
                                            <input
                                                type="number"
                                                value={item.count}
                                                readOnly
                                                className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1"
                                            />
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(item.product.id, item.count + 1)
                                            }
                                            disabled={isUpdating === item.product.id}
                                            className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Increase quantity</span>
                                            <svg
                                                className="w-3 h-3"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 1v16M1 9h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">
                                            Unit: {item.price} EGP
                                        </span>
                                        <span className="text-base font-bold">
                                            Total: {(item.price * item.count).toFixed(2)} EGP
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleRemoveItem(item.product.id)}
                                        disabled={isDeleting === item.product.id}
                                        className={`font-medium text-red-600 hover:underline disabled:opacity-50 ${
                                            isDeleting === item.product.id
                                                ? "cursor-not-allowed"
                                                : "cursor-pointer"
                                        }`}
                                    >
                                        {isDeleting === item.product.id ? "Removing..." : "Remove"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cart Summary - Responsive */}
            <div className="mt-8 px-0 sm:px-6">
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md w-full sm:w-96 md:w-72 ml-auto">
                    <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-xl">{totalCartPrice} EGP</span>
                    </div>
                    <Link to="/CheckOut">
                    <button className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-base font-medium">
                        Proceed to CheckOut
                    </button>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}