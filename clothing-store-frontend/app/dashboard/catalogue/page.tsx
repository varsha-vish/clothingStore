'use client'; // This is a client component because it uses useState, useEffect, and handles user input

import { useState, useEffect } from 'react'; // React hooks for state and lifecycle
import ProductCard from '@/components/ProductCard'; // Our custom ProductCard component
import { Product } from '@/types/product'; // Product type definition

// Directly import the JSON data. In a real application, for larger datasets,
// you might consider fetching this from a local API route (e.g., /api/products)
// or using a server component to read it, but for this requirement, direct import is specified.
import allProductsData from '@/data/products.json';

export default function CataloguePage() {
  // State to hold all products initially loaded
  const [products, setProducts] = useState<Product[]>([]);
  // State to hold the current search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect to load products when the component mounts
  // This simulates fetching data on the client-side.
  useEffect(() => {
    // Cast the imported JSON data to the Product array type
    setProducts(allProductsData as Product[]);
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Filters the list of products based on a search term.
   * This function adheres to the constraint of using explicit loops (for, while)
   * instead of built-in array methods like filter, map, or reduce.
   *
   * @param productsToFilter The array of products to be filtered.
   * @param term The search term (case-insensitive).
   * @returns A new array containing only the products that match the search term.
   */
  const filterProducts = (productsToFilter: Product[], term: string): Product[] => {
    const lowerCaseTerm = term.toLowerCase(); // Convert search term to lowercase for case-insensitive matching
    const filtered: Product[] = []; // Initialize an empty array to store matching products

    // Iterate through each product in the input array using a for loop
    for (let i = 0; i < productsToFilter.length; i++) {
      const product = productsToFilter[i]; // Get the current product

      // Check if the product's name, price, or category includes the search term.
      // Convert product properties to lowercase strings for consistent comparison.
      const nameMatches = product.name.toLowerCase().includes(lowerCaseTerm);
      const priceMatches = product.price.toFixed(2).includes(lowerCaseTerm); // Convert price to string and check
      const categoryMatches = product.category.toLowerCase().includes(lowerCaseTerm);

      // If the search term is empty, or if any of the properties match the term,
      // add the product to the filtered list.
      if (term === '' || nameMatches || priceMatches || categoryMatches) {
        filtered.push(product);
      }
    }
    return filtered; // Return the array of filtered products
  };

  // Apply the filter function to the 'products' state based on the 'searchTerm'
  const displayedProducts = filterProducts(products, searchTerm);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Catalogue</h2>

      {/* Search Bar Input Field */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products by name, price, or category..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          value={searchTerm} // Controlled component: input value is tied to searchTerm state
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
        />
      </div>

      {/* Conditional rendering based on search results */}
      {displayedProducts.length === 0 && searchTerm !== '' ? (
        // Message when no products match the search term
        <p className="text-center text-gray-600 text-lg mt-10">No products found for &quot;{searchTerm}&quot;.</p>
      ) : displayedProducts.length === 0 && searchTerm === '' ? (
        // Message when there are no products loaded at all (e.g., empty JSON)
        <p className="text-center text-gray-600 text-lg mt-10">No products available.</p>
      ) : (
        // Grid layout for displaying product cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            // Render a ProductCard for each product
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}