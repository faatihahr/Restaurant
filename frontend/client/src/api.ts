import axios from 'axios';
import type { Product } from './types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, sign out user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export const productApi = {
  getProducts: async (search?: string): Promise<Product[]> => {
    const startTime = Date.now();
    const params = search ? { search } : {};
    const response = await api.get('/products', { params });
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const startTime = Date.now();
    const response = await api.get(`/products/${id}`);
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data.data;
  },

  getProductsByCategory: async (categoryName: string): Promise<{ [key: string]: Product[] }> => {
    const startTime = Date.now();
    const response = await api.get(`/products/category/${categoryName}`);
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data.data;
  },
};

export const orderApi = {
  createOrder: async (items: { productId: number; quantity: number }[], tableId?: number, userId?: number) => {
    const startTime = Date.now();
    const response = await api.post('/orders/createorders', { items, tableId, userId });
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },
};

export const userApi = {
  getCurrentUser: async () => {
    const startTime = Date.now();
    const response = await api.get('/users/me');
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<{ product: Product; quantity: number }[]> => {
    const startTime = Date.now();
    const response = await api.get('/carts');
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data.data;
  },

  addToCart: async (productId: number, quantity: number) => {
    const startTime = Date.now();
    const response = await api.post('/carts/add-to-cart', { productId, quantity });
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },

  updateCartItem: async (productId: number, quantity: number) => {
    const startTime = Date.now();
    const response = await api.put('/carts/update-item', { productId, quantity });
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },

  removeFromCart: async (productId: number) => {
    const startTime = Date.now();
    const response = await api.delete('/carts/remove-item', { data: { productId } });
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },

  clearCart: async () => {
    const startTime = Date.now();
    const response = await api.delete('/carts/clear');
    const elapsed = Date.now() - startTime;
    const remaining = 800 - elapsed;
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
    return response.data;
  },
};

export default api;
