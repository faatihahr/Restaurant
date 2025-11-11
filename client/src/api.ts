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

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
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

export default api;
