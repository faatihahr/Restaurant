import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';
import CartDetailPage from './pages/CartDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import FloatingCartPopup from './components/FloatingCartPopup';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Routes>
        {/* Public auth routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Public routes */}
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
            <CartDetailPage />
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
        <Route path="/profile" element={
          <ProtectedRoute>
              <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
      <FloatingCartPopup />
    </>
  );
}

export default App;
