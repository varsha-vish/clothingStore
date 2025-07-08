"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/hooks/useCart";
import { User } from "@/types/user";
import { Sale, SaleProduct } from "@/types/sale";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } =
    useCart();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { user: authUser, token, error: authError } = useAuth();
  console.log("Auth User:", authUser);
  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item: CartItem) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const totalPrice = calculateTotalPrice();

  const handleIncreaseQuantity = (
    productId: string,
    currentQuantity: number
  ) => {
    updateCartQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (
    productId: string,
    currentQuantity: number
  ) => {
    updateCartQuantity(productId, currentQuantity - 1);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    setMessage("Item removed from cart.");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleCheckout = async () => {
    setError("");
    setMessage("");

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty. Please add items to your cart before checking out."
      );
      return;
    }

    if (!authUser || !authUser._id || !token) {
      setError(
        authError || "User information not available. Please log in again."
      );
      return;
    }

    const productsForSale = cartItems.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: productsForSale,
        }),
      });
      if (res.ok) {
        clearCart();
        setMessage("Checkout successful! Your order has been placed.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
      {message && (
        <div
          className="bg-green-100 text-green-700 px-4 py-3 mb-4 border border-green-400 rounded"
          role="alert"
        >
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          Your cart is empty
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item: CartItem) => (
            <div
              key={item._id}
              className="flex items-center bg-white rounded-lg shadow-md p-4"
            >
              <div className="w-24 h-24 relative mr-4 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/100x100/e0e0e0/000000?text=Image+Error";
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm">{item.category}</p>
                <p className="text-blue-600 font-bold mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={() =>
                    handleDecreaseQuantity(item._id, item.quantity)
                  }
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="font-semibold text-lg">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleIncreaseQuantity(item._id, item.quantity)
                  }
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800">
                Total Price:
              </span>
              <span className="text-2xl font-extrabold text-blue-700">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors text-lg font-semibold shadow-md"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
