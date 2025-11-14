import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'food', label: 'Food' },
    { key: 'beverages', label: 'Beverages' }
  ];

  const selectedCategoryLabel = categories.find(cat => cat.key === selectedCategory)?.label || 'All';

  return (
    <nav className="mb-10">
      {/* Mobile dropdown */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center font-playfair-display text-lg font-bold px-4 py-3 rounded-xl border-2 border-primary/20 bg-primary/5 text-foreground hover:bg-primary/10 transition-all duration-300"
        >
          {selectedCategoryLabel}
          {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="mt-2 space-y-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => {
                  onCategoryChange(category.key);
                  setIsOpen(false);
                }}
                className={`w-full font-playfair-display text-base font-bold px-4 py-2 rounded-lg border-2 border-transparent transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'text-primary bg-primary/10 border-primary'
                    : 'text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop horizontal layout */}
      <div className="hidden md:flex justify-center space-x-4 lg:space-x-8">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`font-playfair-display text-lg lg:text-xl font-bold px-4 lg:px-6 py-3 rounded-xl border-2 border-transparent transition-all duration-300 tracking-wide relative ${
              selectedCategory === category.key
                ? 'text-primary bg-primary/10 border-primary'
                : 'text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 hover:-translate-y-1'
            }`}
          >
            {category.label}
            {selectedCategory === category.key && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1 bg-primary rounded-sm"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
