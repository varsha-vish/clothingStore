'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantityToAdd: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

//create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        setCartItems([]); // Reset if corrupted
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantityToAdd: number) => {
    setCartItems((prevItems) => {
      let found = false;
      const updatedItems: CartItem[] = [];

      // Constraint: Use explicit loop for finding and updating
      for (let i = 0; i < prevItems.length; i++) {
        const item = prevItems[i];
        if (item._id === product._id) {
          updatedItems.push({ ...item, quantity: item.quantity + quantityToAdd });
          found = true;
        } else {
          updatedItems.push(item);
        }
      }

      if (!found) {
        updatedItems.push({ ...product, quantity: quantityToAdd });
      }
      return updatedItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const filteredItems: CartItem[] = [];
      // Constraint: Use explicit loop for filtering
      for (let i = 0; i < prevItems.length; i++) {
        if (prevItems[i]._id !== productId) {
          filteredItems.push(prevItems[i]);
        }
      }
      return filteredItems;
    });
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems: CartItem[] = [];
      // Constraint: Use explicit loop for updating
      for (let i = 0; i < prevItems.length; i++) {
        const item = prevItems[i];
        if (item._id === productId) {
          if (newQuantity <= 0) {
            // If new quantity is 0 or less, effectively remove the item
            continue; // Skip adding this item to updatedItems
          }
          updatedItems.push({ ...item, quantity: newQuantity });
        } else {
          updatedItems.push(item);
        }
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}