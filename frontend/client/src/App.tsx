import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProductsPage from './pages/ProductsPage';
import CartDetailPage from './pages/CartDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import FloatingCartPopup from './components/FloatingCartPopup';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
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

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
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
