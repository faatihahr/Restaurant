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
          <div className="w-16 h-16 border-4 border-vintage-cream border-t-vintage-gold rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="text-center py-12">
          <p className="text-vintage-brown text-lg">{error || 'Product not found'}</p>
          <Button onClick={handleBackToHome} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="bg-white p-8 rounded-xl border-4 border-vintage-brown shadow-vintage-medium">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image || product.images[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg border-2 border-vintage-brown"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-playfair-display font-bold text-vintage-brown mb-4">
              {product.name}
            </h1>
            <p className="text-vintage-sepia mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-vintage-gold mb-6">${product.price.toFixed(2)}</p>

            <div className="flex items-center gap-4 mb-6">
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
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button onClick={() => addToCart(product)} className="bg-vintage-gold hover:bg-vintage-dark-gold">
                  Add to Cart
                </Button>
              )}
            </div>

            <Button onClick={handleBackToHome} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
