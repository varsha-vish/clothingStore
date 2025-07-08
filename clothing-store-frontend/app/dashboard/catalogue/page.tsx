'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import allProductsData from '@/data/products.json';

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(allProductsData as Product[]);
  }, []); 


  const filterProducts = (productsToFilter: Product[], term: string): Product[] => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered: Product[] = []; 

    for (let i = 0; i < productsToFilter.length; i++) {
      const product = productsToFilter[i]; 

      const nameMatches = product.name.toLowerCase().includes(lowerCaseTerm);
      const priceMatches = product.price.toFixed(2).includes(lowerCaseTerm); 
      const categoryMatches = product.category.toLowerCase().includes(lowerCaseTerm);

      if (term === '' || nameMatches || priceMatches || categoryMatches) {
        filtered.push(product);
      }
    }
    return filtered;
  };

  const displayedProducts = filterProducts(products, searchTerm);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Catalogue</h2>

      {/* Search Bar Input Field */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products by name, price, or category..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-gray-700"
          value={searchTerm} // Controlled component: input value is tied to searchTerm state
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Conditional rendering based on search results */}
      {displayedProducts.length === 0 && searchTerm !== '' ? (
        <p className="text-center text-gray-600 text-lg mt-10">No products found for &quot;{searchTerm}&quot;.</p>
      ) : displayedProducts.length === 0 && searchTerm === '' ? (
        <p className="text-center text-gray-600 text-lg mt-10">No products available.</p>
      ) : (
        // Grid layout for displaying product cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}