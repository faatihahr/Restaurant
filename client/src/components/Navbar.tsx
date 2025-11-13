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
    <nav>
      <div className="flex justify-center space-x-8">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`font-playfair-display text-xl font-bold px-6 py-3 rounded-xl border-2 border-transparent transition-all duration-300 tracking-wide relative ${
              selectedCategory === category.key
                ? 'text-vintage-gold bg-vintage-gold/10 border-vintage-gold shadow-vintage-gold'
                : 'text-vintage-brown hover:text-vintage-sepia hover:bg-vintage-brown/5 hover:border-vintage-brown/20 hover:-translate-y-1'
            }`}
          >
            {category.label}
            {selectedCategory === category.key && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-vintage-gold to-vintage-dark-gold rounded-sm"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
