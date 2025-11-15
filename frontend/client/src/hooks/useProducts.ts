import { useState, useEffect } from 'react';
import { productApi } from '../api';
import type { Product } from '../types';

export const useProducts = (selectedCategory: string, debouncedSearchQuery: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, debouncedSearchQuery]);

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
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
