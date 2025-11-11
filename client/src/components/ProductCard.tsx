import React from 'react';
import type { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
}) => {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleRemoveFromCart = () => {
    onRemoveFromCart(product.id);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      onUpdateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      onUpdateQuantity(product.id, cartItem.quantity - 1);
    } else {
      handleRemoveFromCart();
    }
  };

  const imageUrl = product.image
    ? `http://localhost:3000${product.image}`
    : '/placeholder-image.png';

  return (
    <div className="card-vintage hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg border-b-2 border-vintage-gold"
      />
      <div className="p-4">
        <h3 className="text-xl font-serif font-bold text-vintage-brown mb-2">{product.name}</h3>
        <p className="text-vintage-sepia text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold text-vintage-gold mb-2">${product.price.toFixed(2)}</p>
        <p className="text-xs text-vintage-brown bg-vintage-parchment px-2 py-1 rounded-full inline-block mb-4">
          {product.category.name}
        </p>

        {isInCart ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleDecreaseQuantity}
              className="btn-vintage w-8 h-8 flex items-center justify-center text-lg font-bold"
            >
              -
            </button>
            <span className="text-vintage-brown font-bold text-lg min-w-[2rem] text-center">
              {cartItem.quantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              className="btn-vintage w-8 h-8 flex items-center justify-center text-lg font-bold"
            >
              +
            </button>
            <button
              onClick={handleRemoveFromCart}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="btn-vintage w-full text-center"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
