import axios from 'axios';

// Create axios instance WITHOUT base URL
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    
    // Handle inconsistent backend routing
    if (config.url?.startsWith('/auth')) {
      // Auth endpoints: /auth/login, /auth/register
      config.baseURL = 'http://localhost:8080';
    } else if (config.url?.startsWith('/flights') || config.url?.startsWith('/bookings')) {
      // Other endpoints: /api/flights, /api/bookings
      config.baseURL = 'http://localhost:8080/api';
    } else {
      // Default
      config.baseURL = 'http://localhost:8080';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
