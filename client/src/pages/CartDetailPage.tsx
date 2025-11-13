import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';

const CartDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="text-4xl font-playfair-display font-black text-vintage-brown text-center mb-8 drop-shadow-lg tracking-wider">
        Detail Cart
      </h1>

      <div className="bg-white p-8 rounded-xl border-4 border-vintage-brown shadow-vintage-medium">
        <h2 className="text-2xl font-bold text-vintage-sepia mb-6">Order Summary</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-vintage-brown text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center border-b border-vintage-cream pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-vintage-brown">{item.product.name}</h3>
                    <p className="text-sm text-vintage-sepia">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-vintage-gold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-vintage-sepia">${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-vintage-brown pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-vintage-sepia">Total:</span>
                <span className="text-vintage-gold">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleBackToHome}
            className="bg-vintage-gold hover:bg-vintage-dark-gold text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartDetailPage;
