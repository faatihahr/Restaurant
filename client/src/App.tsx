import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductsPage from './pages/ProductsPage';
import CartDetailPage from './pages/CartDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Routes>
      <Route path="/" element={
        <Layout
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchQuery}
          showFilters={false}
        >
          <ProductsPage
            selectedCategory={selectedCategory}
            debouncedSearchQuery={debouncedSearchQuery}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={setSearchQuery}
          />
        </Layout>
      } />
      <Route path="/cart-detail" element={
        <Layout
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchQuery}
        >
          <CartDetailPage />
        </Layout>
      } />
      <Route path="/product/:id" element={
        <Layout
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchQuery}
        >
          <ProductDetailPage />
        </Layout>
      } />
    </Routes>
  );
}

export default App;
