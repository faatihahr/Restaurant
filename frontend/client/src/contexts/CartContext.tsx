import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { cartApi } from '../api';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product) => {
    setIsLoading(true);
    try {
      await cartApi.addToCart(product.id, 1);
      // Update local state after successful API call
      setCartItems(prev => {
        const existingItem = prev.find(item => item.product.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { product, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setIsLoading(true);
    try {
      await cartApi.removeFromCart(productId);
      // Update local state after successful API call
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setIsLoading(true);
    try {
      await cartApi.updateCartItem(productId, quantity);
      // Update local state after successful API call
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const setCartItemsDirect = (items: CartItem[]) => {
    setCartItems(items);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartItems: setCartItemsDirect,
    getTotalItems,
    getTotalPrice,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
