import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [cartId, setCartId] = useState(null);
    const [userId, setUserId] = useState();

    useEffect(() => {
        getCartItems();
    }, []);

    async function getCartItems() {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
                headers: { token }
            });
            
            if (response.data.status === 'success') {
                // Map the products to include both id and _id
                const mappedProducts = response.data.data.products.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        id: item.product.id // Add id while keeping _id
                    }
                }));
                setCartItems(mappedProducts);
                setCartCount(response.data.numOfCartItems);
                setTotalCartPrice(response.data.data.totalCartPrice);
                setCartId(response.data.cartId);
                setUserId(response.data.data.cartOwner);
            }
            return response;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setCartItems([]);
            setCartCount(0);
            setTotalCartPrice(0);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function addToCart(productId) {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                'https://ecommerce.routemisr.com/api/v1/cart',
                { productId },
                { headers: { token } }
            );

            if (response.data.status === 'success') {
                setCartCount(response.data.numOfCartItems);
                const mappedProducts = response.data.data.products.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        id: item.product.id
                    }
                }));
                setCartItems(mappedProducts);
                setCartId(response.data.cartId);
                setUserId(response.data.data.cartOwner);


                return response;
            }
            throw new Error('Failed to add item to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function removeFromCart(productId) {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Use id for API call
            const response = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
                { headers: { token } }
            );

            if (response.data.status === 'success') {
                const mappedProducts = response.data.data.products.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        id: item.product.id
                    }
                }));
                setCartItems(mappedProducts);
                setCartCount(response.data.numOfCartItems);
                setTotalCartPrice(response.data.data.totalCartPrice);
                setCartId(response.data.cartId);
                setUserId(response.data.data.cartOwner);


                return response;
            }
            throw new Error('Failed to remove item from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function updateCartQuantity(productId, count) {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Find the item in cartItems to get the _id
            const item = cartItems.find(item => item.product.id === productId);
            if (!item) throw new Error('Item not found in cart');

            const response = await axios.put(
                `https://ecommerce.routemisr.com/api/v1/cart/${item.product._id}`,
                { count },
                { headers: { token } }
            );

            if (response.data.status === 'success') {
                const mappedProducts = response.data.data.products.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        id: item.product.id
                    }
                }));
                setCartItems(mappedProducts);
                setTotalCartPrice(response.data.data.totalCartPrice);
                setCartCount(response.data.numOfCartItems);
                setCartId(response.data.cartId)
                console.log(response.data.cartId)

                return response;
            }
            throw new Error('Failed to update quantity');
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function Payment(shippingAddress, paymentMethod) {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            let response;
            if (paymentMethod === 'online') {
                // Online payment using Stripe
                response = await axios.post(
                    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=https://ahmed-elghwab.github.io`,
                    {
                        shippingAddress: shippingAddress
                    },
                    { 
                        headers: { token: token }
                    }
                );
            } else {
                // Cash on delivery
                response = await axios.post(
                    `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
                    {
                        shippingAddress: shippingAddress
                    },
                    { 
                        headers: { token: token }
                    }
                );
            }

            if (response.data.status === 'success') {
                setCartItems([]);
                setCartCount(0);
                setTotalCartPrice(0);
                return response;
            }
            throw new Error('Payment processing failed');
        } catch (error) {
            console.error('Payment error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }


    async function clearCart() {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.delete(
                'https://ecommerce.routemisr.com/api/v1/cart',
                {
                    headers: { 
                        'token': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.message === 'success') {
                setCartItems([]);
                setCartCount(0);
                setTotalCartPrice(0);
                setCartId(null)

                return response;
            } else {
                throw new Error('Failed to clear cart');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function isItemInCart(productId) {
        return cartItems.some(item => 
            item.product?.id === productId || item.product?.id === productId
        );
    }

    const contextValue = {
        addToCart,
        getCartItems,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isItemInCart,
        cartCount,
        cartItems,
        loading,
        totalCartPrice,
        setCartItems,
        cartId,
        setCartId,
        Payment,
        userId
        
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}
