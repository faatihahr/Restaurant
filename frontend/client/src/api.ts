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
    const params = search ? { search } : {};
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  getProductsByCategory: async (categoryName: string): Promise<{ [key: string]: Product[] }> => {
    const response = await api.get(`/products/category/${categoryName}`);
    return response.data.data;
  },
};

export const orderApi = {
  createOrder: async (items: { productId: number; quantity: number }[], tableId?: number, userId?: number) => {
    const response = await api.post('/orders/createorders', { items, tableId, userId });
    return response.data;
  },
};

export const userApi = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export default api;
