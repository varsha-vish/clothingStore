'use client'; // This is a client component as it uses useState and handles user interaction

import Image from 'next/image'; // Optimized image component from Next.js
import Link from 'next/link';   // For client-side navigation
import { useState } from 'react'; // For managing hover state
import { Product } from '@/types/product'; // Product type definition
import { useCart } from '@/hooks/useCart'; // Custom cart hook

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false); // State to track if mouse is hovering
  const { addToCart } = useCart(); // Access addToCart function from our cart context

  // Handler for adding product to cart
  const handleAddToCart = () => {
    addToCart(product, 1); // Add 1 quantity of the product to the cart
    // Provide user feedback (using a simple alert as per general instructions,
    // though in a real app, a custom toast/modal would be better)
    alert(`${product.name} added to cart!`);
  };

  return (
    // Main container for the product card
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)} // Set hovered state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hovered state to false on mouse leave
    >
      {/* Product Image */}
      <div className="w-full h-48 relative">
        <Image
          src={product.imageUrl} // Source URL of the product image
          alt={product.name}    // Alt text for accessibility
          layout="fill"         // Image will fill the parent div
          objectFit="cover"     // Ensures the image covers the area without distortion
          className="transition-opacity duration-300 group-hover:opacity-80 rounded-t-lg" // Smooth opacity transition
          // Fallback for image loading errors (optional but good practice)
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x300/e0e0e0/000000?text=Image+Error';
          }}
        />
      </div>

      {/* Product Information */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{product.category}</p>
        <p className="text-xl font-bold text-green-500 mb-4">
          ${product.price.toFixed(2)}
        </p>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-300 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}