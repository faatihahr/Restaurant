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
    ? product.image.replace('/src/uploads', '/api/uploads')
    : '/placeholder-image.png';

  return (
    <div onClick={onClick} className="cursor-pointer">
      <Card className="transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-60 object-cover rounded-t-xl border-b border-border transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm border border-primary">
            {product.category.name}
          </span>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h2 className="font-playfair-display text-xl font-bold text-card-foreground mb-3 leading-tight">
          {product.name}
        </h2>
        <p className="text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-1">
          {product.description}
        </p>
        <p className="font-playfair-display text-xl font-bold text-primary mb-6">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-auto">
          {isInCart ? (
            <>
              <div className="flex justify-center items-center gap-2 sm:gap-1">
                <Button
                  onClick={handleDecreaseQuantity}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-7 sm:h-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm"
                >
                  -
                </Button>
                <span className="text-card-foreground font-bold text-lg min-w-8 text-center flex items-center justify-center">
                  {cartItem.quantity}
                </span>
                <Button
                  onClick={handleIncreaseQuantity}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-7 sm:h-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm"
                >
                  +
                </Button>
              </div>
              <Button
                onClick={handleRemoveFromCart}
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto"
              >
                Remove
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
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
