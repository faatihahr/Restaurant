import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    // Add a small delay for better UX
    setTimeout(() => {
      logout();
      setIsSigningOut(false);
      navigate('/');
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="min-h-screen py-12">
      {/* Header with user info and sign out */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl sm:text-3xl font-playfair-display font-bold text-foreground drop-shadow-lg">Restaurant Order</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden sm:block text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer truncate max-w-48"
                  >
                    Welcome, {user.name} (Points: {user.point})
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="sm:hidden text-xs text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                  >
                    {user.name.split(' ')[0]} ({user.point})
                  </button>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="bg-destructive hover:bg-destructive/90 disabled:bg-destructive/50 text-destructive-foreground px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
                  >
                    {isSigningOut && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                    <span className="hidden sm:inline">{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
                    <span className="sm:hidden">{isSigningOut ? 'Out...' : 'Out'}</span>
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/sign-in')}
                  variant="outline"
                  size="sm"
                  className="px-2 sm:px-3"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content with top padding to account for fixed header */}
      <div className="pt-16">
        {showFilters && (
          <>
            <Navbar selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
