import React from 'react';
import type { Product, CartItem } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClick,
}) => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    onAddToCart(product);
  };

  const handleRemoveFromCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemoveFromCart(product.id);
  };

  const handleIncreaseQuantity = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (cartItem) {
      onUpdateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (cartItem && cartItem.quantity > 1) {
      onUpdateQuantity(product.id, cartItem.quantity - 1);
    } else {
      handleRemoveFromCart(event);
    }
  };

  const imageUrl = product.image
    ? `http://localhost:3000${product.image}`
    : '/placeholder-image.png';

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card className="bg-vintage-ivory border-vintage-brown shadow-vintage-light hover:shadow-vintage-medium transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border-4 rounded-2xl overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-60 object-cover rounded-t-xl border-b-4 border-vintage-brown transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-vintage-gold text-vintage-brown px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-vintage-light border border-vintage-dark-gold">
            {product.category.name}
          </span>
        </div>
      </div>
      <CardContent className="p-6 bg-gradient-to-b from-white/80 to-transparent flex-1 flex flex-col">
        <h2 className="font-playfair-display text-xl font-bold text-vintage-brown mb-3 leading-tight">
          {product.name}
        </h2>
        <p className="text-vintage-sepia mb-4 flex-1 leading-relaxed line-clamp-1">
          {product.description}
        </p>
        <p className="font-playfair-display text-xl font-bold text-vintage-gold mb-6 text-shadow">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex justify-center gap-2 mt-auto">
          {isInCart ? (
            <>
              <Button
                onClick={handleDecreaseQuantity}
                variant="outline"
                size="icon"
                className="w-8 h-8 bg-vintage-gold hover:bg-vintage-dark-gold text-vintage-brown font-bold border-vintage-brown"
              >
                -
              </Button>
              <span className="text-vintage-brown font-bold text-lg min-w-8 text-center flex items-center justify-center">
                {cartItem.quantity}
              </span>
              <Button
                onClick={handleIncreaseQuantity}
                variant="outline"
                size="icon"
                className="w-8 h-8 bg-vintage-gold hover:bg-vintage-dark-gold text-vintage-brown font-bold border-vintage-brown"
              >
                +
              </Button>
              <Button
                onClick={handleRemoveFromCart}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Remove
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="bg-vintage-gold hover:bg-vintage-dark-gold text-vintage-brown border-vintage-brown font-bold px-6 py-2 rounded-lg shadow-vintage-light hover:shadow-vintage-medium transition-all duration-300 hover:-translate-y-1"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default ProductCard;
