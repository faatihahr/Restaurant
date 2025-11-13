import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="max-w-2xl mx-auto mb-10 p-8 bg-gradient-to-br from-vintage-ivory to-vintage-cream rounded-xl border-4 border-vintage-brown shadow-vintage-light relative hover:shadow-vintage-medium transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <label htmlFor="search" className="text-lg font-crimson-text text-vintage-sepia">Cari Produk:</label>
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan nama produk..."
          className="flex-1 px-5 py-3 border-2 border-vintage-sepia rounded-xl font-crimson-text bg-white text-vintage-brown placeholder:text-vintage-sepia/70 focus:outline-none focus:border-vintage-gold focus:ring-2 focus:ring-vintage-gold/20 transition-all duration-300 shadow-inner"
        />
      </div>
    </div>
  );
};

export default SearchBar;
