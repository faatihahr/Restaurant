import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="search-bar mb-8">
      <div className="flex items-center space-x-4">
        <label htmlFor="search" className="text-lg font-serif text-vintage-sepia">Cari Produk:</label>
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan nama produk..."
          className="flex-1 px-4 py-3 border border-vintage-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-gold bg-white text-vintage-brown placeholder-vintage-sepia"
        />
      </div>
    </div>
  );
};

export default SearchBar;
