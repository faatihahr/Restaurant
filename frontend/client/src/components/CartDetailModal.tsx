import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { orderApi, userApi } from '../api';
import { Minus, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface CartDetailModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CartDetailModal: React.FC<CartDetailModalProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const { cartItems, clearCart, updateQuantity, removeFromCart, getTotalPrice, setCartItems } = useCart();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);
  const [lastOrderItems, setLastOrderItems] = useState<any[]>([]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    setOrderMessage(null);
    setOrderError(null);

    // Optimistic update: store current cart for rollback, clear cart
    const currentCart = [...cartItems];
    const totalBefore = getTotalPrice();
    clearCart();

    try {
      // Get user data from localStorage if available
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      // Prepare order items
      const items = currentCart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await orderApi.createOrder(items, undefined, userId);

      setOrderMessage(response.message);
      setLastOrderTotal(totalBefore);
      setLastOrderItems(currentCart);
      setShowOrderSummary(true);

      // Refresh user data to get updated points
      if (userId) {
        try {
          const userResponse = await userApi.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(userResponse.user));
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
    } catch (error: any) {
      // Rollback: restore cart by setting back to localStorage
      localStorage.setItem('cart', JSON.stringify(currentCart));
      setOrderError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const closeOrderSummary = () => {
    setShowOrderSummary(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {controlledOpen === undefined && (
          <DialogTrigger asChild>{children}</DialogTrigger>
        )}
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair-display font-black text-foreground text-center drop-shadow-lg tracking-wider">
              Detail Cart
            </DialogTitle>
          </DialogHeader>

          <div className="bg-card p-8 rounded-xl border border-border shadow-md mt-4">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Summary</h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border pb-4 gap-2 sm:gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground text-lg sm:text-base">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted disabled:opacity-50"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="px-3 py-1 min-w-[40px] text-center font-medium">{item.quantity}</span>
                          <Button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          onClick={() => handleRemoveItem(item.product.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-bold text-primary text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
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

            <div className="mt-8 flex justify-end gap-4">
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
                onClick={() => setOpen(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Summary Modal */}
      <Dialog open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Order Summary</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {lastOrderItems.map((item: any) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                Total: ${lastOrderTotal.toFixed(2)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-green-600 font-semibold">{orderMessage}</p>
            </div>

            <Button onClick={closeOrderSummary} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDetailModal;
