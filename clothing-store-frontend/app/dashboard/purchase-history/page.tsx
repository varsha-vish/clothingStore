"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sale, SaleProduct } from "@/types/sale"; // Make sure Sale and SaleProduct are correctly defined
import Image from "next/image";
import productsData from "@/data/products.json";

export default function PurchaseHistoryPage() {
  const { user: authUser, token, isLoading: authLoading, error: authError } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productImageMap, setProductImageMap] = useState<Record<string, string>>({});
  

  // 3. Populate the productImageMap from productsData once
  useEffect(() => {
    const map = productsData.reduce((acc: Record<string, string>, product) => {
      acc[product._id] = product.imageUrl;
      return acc;
    }, {});
    setProductImageMap(map);
  }, []);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (authLoading) {
        return;
      }

      if (!authUser || !authUser._id || !token) {
        setIsLoading(false);
        setError(authError || "You must be logged in to view your purchase history.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/${authUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseBody = await response.json(); 
          const data: Sale[] = responseBody.sales; 

          if (Array.isArray(data)) {
            setPurchaseHistory(data);
          } else {
            setPurchaseHistory([]);
            console.warn("Backend 'sales' property returned non-array:", data);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to load purchase history.");
          console.error("Failed to fetch purchase history:", errorData);
        }
      } catch (err) {
        setError("Network error: Could not fetch purchase history. Please check your connection.");
        console.error("Network error fetching purchase history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [authUser, token, authLoading, authError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading purchase history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Purchase History</h2>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Purchase History</h2>

      {purchaseHistory.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          You haven't made any purchases yet.
        </p>
      ) : (
        <div className="space-y-6">
          {purchaseHistory.map((sale) => (
            <div key={sale.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Order #
                  {sale.id ? sale.id : 'N/A'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Date: {new Date(sale.saleDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-4">
                {sale.products.map((product) => {
                   const imageUrl = productImageMap[product.productId];
                   return (
                  <div key={product.productId} className="flex items-center bg-gray-50 rounded-md p-3">
                    <div className="w-16 h-16 relative mr-4 flex-shrink-0">
                     <Image
                          // Use the fetched imageUrl, or a fallback if not found
                          src={imageUrl}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/64?text=Image+Error";
                          }}
                        />
                    </div>
                    
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        ${product.price.toFixed(2)} x {product.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-600">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4 flex justify-end items-center">
                <span className="text-lg font-bold text-gray-800">
                  Total:
                </span>
                <span className="text-xl font-extrabold text-gray-700 ml-2">
                  ${sale.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}