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
    <nav className="container">
      <div className="display-flex justify-center space-x-8">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`navbar-button ${selectedCategory === category.key ? 'selected' : ''}`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
