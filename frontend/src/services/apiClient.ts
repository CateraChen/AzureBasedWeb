import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Attach guest session ID for cart
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) config.headers['X-Session-Id'] = sessionId;

  return config;
});

export default api;
