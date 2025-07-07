'use client'; // This is a client component due to useState, useParams, and cart interaction.

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For getting URL params and navigation
import Image from 'next/image'; // For optimized images
import { Product } from '@/types/product'; // Product type definition
import { useCart } from '@/hooks/useCart'; // Custom cart hook

// Directly import the JSON data (as per frontend requirement)
import allProductsData from '@/data/products.json';

export default function ProductDetailPage() {
  const params = useParams(); // Hook to get route parameters
  const router = useRouter();   // Hook for programmatic navigation
  const { productId } = params; // Extract productId from the URL
  const { addToCart } = useCart(); // Access addToCart function from our cart context

  const [product, setProduct] = useState<Product | null>(null); // State to hold the fetched product
  const [quantity, setQuantity] = useState(1); // State for the quantity to add to cart

  // Effect to load product data based on productId from URL
  useEffect(() => {
    if (productId) {
      // Find the product using an explicit loop (as per constraint)
      let foundProduct: Product | null = null;
      // We assume allProductsData is already parsed from JSON import
      const productsArray = allProductsData as Product[];

      for (let i = 0; i < productsArray.length; i++) {
        if (productsArray[i]._id === productId) {
          foundProduct = productsArray[i];
          break; // Found the product, no need to continue loop
        }
      }

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Handle case where product is not found (e.g., invalid ID)
        console.error(`Product with ID ${productId} not found.`);
        router.push('dashboard/catalogue'); // Redirect back to catalogue or a 404 page
      }
    }
  }, [productId, router]); // Re-run effect if productId or router changes

  // Handlers for quantity controls
  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Don't go below 1
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handler for adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity); // Add the selected quantity
      alert(`${quantity} of ${product.name} added to cart!`);
      setQuantity(1); // Reset quantity after adding to cart
    }
  };

  if (!product) {
    // Show a loading state or a message while product is being fetched/not found
    return (
      <div className="flex justify-center items-center h-full text-lg text-gray-600">
        Loading product details...
      </div>
    );
  }

  // Once product is loaded, display its details
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Product Image Section */}
      <div className="md:w-1/2 flex-shrink-0">
        <div className="relative w-full h-80 sm:h-96 md:h-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="contain" // Use 'contain' to show full image without cropping
            className="rounded-lg"
            priority // Load this image with high priority
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/500x500/e0e0e0/000000?text=Image+Error';
            }}
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">${product.price.toFixed(2)}</p>
          <p className="text-sm font-medium text-blue-600 mb-4">{product.category}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
        </div>

        {/* Quantity Controls and Add to Cart */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-4 border-t border-gray-200">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md p-1">
            <button
              onClick={handleDecreaseQuantity}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10);
                setQuantity(isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity);
              }}
              className="w-16 text-center border-x border-gray-300 mx-1 py-1 focus:outline-none"
              min="1"
            />
            <button
              onClick={handleIncreaseQuantity}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-grow bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors shadow-md text-lg font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}