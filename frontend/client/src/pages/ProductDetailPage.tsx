import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import type { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProductById(parseInt(id!));
      setProduct(data);
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getCartItem = () => {
    return cartItems.find(item => item.product.id === product?.id);
  };

  const cartItem = getCartItem();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="flex justify-center items-center py-16">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="text-center py-12">
          <p className="text-foreground text-lg">{error || 'Product not found'}</p>
          <Button onClick={handleBackToHome} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
      <div className="bg-card p-4 sm:p-8 rounded-xl border border-border shadow-md">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image || product.images[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-64 sm:h-96 object-cover rounded-lg border border-border"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-2xl sm:text-3xl font-playfair-display font-bold text-card-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">{product.description}</p>
            <p className="text-xl sm:text-2xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              {cartItem ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    variant="outline"
                    size="sm"
                  >
                    -
                  </Button>
                  <span className="px-3 py-1 border rounded">{cartItem.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    variant="outline"
                    size="sm"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => removeFromCart(product.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button onClick={() => addToCart(product)} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Add to Cart
                </Button>
              )}
            </div>

            <Button onClick={handleBackToHome} variant="outline" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
