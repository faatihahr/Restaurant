import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { productApi } from '../api';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data: Product[];
      if (selectedCategory === 'all') {
        data = await productApi.getProducts();
      } else {
        const categoryData = await productApi.getProductsByCategory(selectedCategory);
        data = categoryData[selectedCategory === 'food' ? 'Food' : 'Beverages'] || [];
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-vintage-brown text-xl font-serif animate-pulse">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl font-serif bg-red-50 p-4 rounded-lg border-red-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-cursive text-vintage-brown text-center mb-8 drop-shadow-sm">
        Daftar Menu
      </h1>
      <Navbar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <div className="card-vintage mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-serif text-vintage-sepia">Cart ({getTotalItems()} items)</h2>
        <p className="text-xl font-bold text-vintage-gold">Total: ${getTotalPrice().toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default ProductsPage;
