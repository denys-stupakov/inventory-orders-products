import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email: string, password: string) =>
  api.post<{ token: string; user: { id: number; email: string; name: string } }>('/auth/login', { email, password });

export const getMe = () =>
  api.get<{ id: number; email: string; name: string }>('/auth/me');

// Orders
export const fetchOrders = () => api.get('/orders');
export const createOrder = (data: { title: string; date: string; description?: string }) =>
  api.post('/orders', data);
export const removeOrder = (id: number) => api.delete(`/orders/${id}`);

// Products
export const fetchProducts = () => api.get('/products');
export const removeProduct = (id: number) => api.delete(`/products/${id}`);

export default api;
