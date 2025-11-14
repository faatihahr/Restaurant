import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { orderApi, userApi } from '../api';

const CartDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    setOrderMessage(null);
    setOrderError(null);

    try {
      // Get user data from localStorage if available
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      // Prepare order items
      const items = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      const response = await orderApi.createOrder(items, undefined, userId);

      setOrderMessage(response.message);
      clearCart(); // Clear the cart after successful order

      // Refresh user data to get updated points
      if (userId) {
        try {
          const userResponse = await userApi.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(userResponse.user));
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }

      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error: any) {
      setOrderError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="text-4xl font-playfair-display font-black text-foreground text-center mb-8 drop-shadow-lg tracking-wider">
        Detail Cart
      </h1>

      <div className="bg-card p-8 rounded-xl border border-border shadow-md">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Summary</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border pb-4 gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground text-lg sm:text-base">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground sm:hidden">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-primary text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground hidden sm:block">${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-border pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Order Messages */}
        {orderMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">{orderMessage}</p>
          </div>
        )}

        {orderError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{orderError}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          {cartItems.length > 0 && (
            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          )}
          <Button
            onClick={handleBackToHome}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartDetailPage;
