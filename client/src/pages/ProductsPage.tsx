import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { productApi } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

interface ProductsPageProps {
  selectedCategory: string;
  debouncedSearchQuery: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (value: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  selectedCategory,
  debouncedSearchQuery,
  searchQuery,
  onCategoryChange,
  onSearchChange
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

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

  const handleCartClick = () => {
    navigate('/cart-detail');
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="max-w-7xl mx-auto px-5">
      <h1 className="text-6xl font-playfair-display font-black text-vintage-brown text-center mb-12 drop-shadow-lg tracking-wider relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-48 after:h-1 after:bg-gradient-to-r after:from-transparent after:via-vintage-gold after:to-transparent after:rounded-sm">
        Daftar Menu
      </h1>
      <Navbar selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <div
        className="bg-gradient-to-br from-vintage-ivory to-vintage-cream p-6 mb-10 rounded-xl border-4 border-vintage-brown shadow-vintage-medium flex justify-between items-center cursor-pointer hover:shadow-vintage-gold transition-shadow"
        onClick={handleCartClick}
      >
        <h2 className="text-2xl font-bold text-vintage-sepia">Cart ({getTotalItems()} items)</h2>
        <p className="text-xl font-bold text-vintage-gold">Total: ${getTotalPrice().toFixed(2)}</p>
      </div>
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-600 text-xl font-crimson-text bg-red-50 p-4 rounded-lg border border-red-200 inline-block">
            {error}
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 border-4 border-vintage-cream border-t-vintage-gold rounded-full animate-spin shadow-vintage-gold"></div>
          <div className="text-vintage-brown text-xl font-crimson-text animate-pulse">Memuat produk...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-vintage-sepia text-lg font-crimson-text mb-2">
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
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
