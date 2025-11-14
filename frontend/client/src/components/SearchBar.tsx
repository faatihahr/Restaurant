import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="max-w-2xl mx-auto mb-10 p-4 sm:p-8 bg-card rounded-2xl border border-border shadow-sm relative hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <label htmlFor="search" className="text-base sm:text-lg font-crimson-text text-muted-foreground sm:flex-shrink-0">
          Cari Produk:
        </label>
        <input
          id="search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan nama produk..."
          className="w-full px-4 sm:px-5 py-3 border border-input rounded-2xl font-crimson-text bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all duration-300 text-base"
        />
      </div>
    </div>
  );
};

export default SearchBar;
