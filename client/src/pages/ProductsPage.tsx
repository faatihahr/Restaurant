import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { productApi } from '../api';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  // Debouncing 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, debouncedSearchQuery]);


  // Fetch products function
  const fetchProducts = async () => {
  try {
    setLoading(true);
    const startTime = Date.now(); 

    let data: Product[];
    if (selectedCategory === 'all') {
      data = await productApi.getProducts(debouncedSearchQuery || undefined);
    } else {
      const categoryData = await productApi.getProductsByCategory(selectedCategory);
      data = categoryData[selectedCategory === 'food' ? 'Food' : 'Beverages'] || [];

      if (debouncedSearchQuery) {
        data = data.filter(product =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
    }
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    setProducts(data);
  } catch (err) {
    setError('Failed to fetch products');
    console.error('Error fetching products:', err);
  } finally {
    setLoading(false);
  }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <div className="container">
      <h1 className="text-5xl font-cursive text-vintage-brown text-center mb-12 drop-shadow-lg tracking-wider">
        Daftar Menu
      </h1>
      <Navbar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="card mb-10 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-vintage-sepia">Cart ({getTotalItems()} items)</h2>
        <p className="text-xl font-bold text-vintage-gold">Total: ${getTotalPrice().toFixed(2)}</p>
      </div>
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-600 text-xl font-serif bg-red-50 p-4 rounded-lg border-red-200 inline-block">
            {error}
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="loader"></div>
            <div className="text-vintage-brown text-xl font-serif animate-pulse"> Memuat produk...
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-vintage-sepia text-lg font-serif mb-2">
            {debouncedSearchQuery ? `Tidak ada produk yang cocok dengan "${debouncedSearchQuery}"` : 'Tidak ada produk tersedia'}
          </div>
          <div className="text-vintage-brown text-sm">
            {debouncedSearchQuery ? 'Coba kata kunci yang berbeda atau hapus filter pencarian.' : 'Produk akan segera ditambahkan.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cartItems}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
