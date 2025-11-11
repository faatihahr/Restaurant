import React from 'react';

interface NavbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'food', label: 'Food' },
    { key: 'beverages', label: 'Beverages' }
  ];

  return (
    <nav className="navbar-vintage mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`navbar-btn ${selectedCategory === category.key ? 'active' : ''}`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
