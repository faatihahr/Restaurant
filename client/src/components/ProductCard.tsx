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
    <div className="card">
      <img src={imageUrl}alt={product.name}className="image"/>
      <div style={{ padding: '0 1rem', textAlign: 'right', marginBottom: '0.5rem' }}>
        <p className="category" style={{ display: 'inline-block' }}>
          {product.category.name}
        </p>
      </div>
      <div className="content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
      </div>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {isInCart ? (
            <>
              <button
                onClick={handleDecreaseQuantity}
                className="btn-vintage"
                style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold' }}
              >
                -
              </button>
              <span style={{ color: '#8B4513', fontWeight: 'bold', fontSize: '1.125rem', minWidth: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                className="btn-vintage"
                style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold' }}
              >
                +
              </button>
              <button
                onClick={handleRemoveFromCart}
                style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                Remove
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className="btn-vintage"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
