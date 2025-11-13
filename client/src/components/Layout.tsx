import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

interface LayoutProps {
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
  showFilters?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  children,
  showFilters = true
}) => {
  return (
    <div className="min-h-screen py-12">
      {showFilters && (
        <>
          <Navbar selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </>
      )}
      {children}
    </div>
  );
};

export default Layout;
