'use client';

import Image from 'next/image'; 
import Link from 'next/link';  
import { useState } from 'react'; 
import { Product } from '@/types/product'; 
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false); 
  const { addToCart } = useCart(); 

  const handleAddToCart = () => {
    addToCart(product, 1); 
    alert(`${product.name} added to cart!`);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} 
    >
      <div className="w-full h-48 relative">
        <Image
          src={product.imageUrl} 
          alt={product.name}    
          layout="fill"        
          objectFit="cover"
          className="transition-opacity duration-300 group-hover:opacity-80 rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x300/e0e0e0/000000?text=Image+Error';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{product.category}</p>
        <p className="text-xl font-bold text-green-500 mb-4">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-300 text-white py-2 px-4 rounded-md hover:bg-orange-500 transition-colors shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}