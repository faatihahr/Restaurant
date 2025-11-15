import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';

const FloatingCartPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 200 && totalItems > 0;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalItems]);

  const handleClick = () => {
    navigate('/cart-detail');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="p-4 min-w-[280px] cursor-pointer" onClick={handleClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-full p-2">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-card-foreground font-playfair-display font-semibold text-sm">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </p>
              <p className="text-primary font-crimson-text text-xs flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <Button size="sm">
            View Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FloatingCartPopup;
