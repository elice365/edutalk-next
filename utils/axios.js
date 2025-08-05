import axios from 'axios';

// Create axios instance with configuration
const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    
    return config;
  },
  (error) => {
    if (APP_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle common HTTP status codes
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            // Don't redirect here - let components handle it
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          break;
        case 429:
          // Rate limiting
          console.warn('Rate limit exceeded');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          if (APP_ENV === 'development') {
            console.error('Server error:', status, data);
          }
          break;
      }
    } else if (error.request) {
      // Network error
      if (APP_ENV === 'development') {
        console.error('Network error:', error.message);
      }
    } else {
      // Request setup error
      if (APP_ENV === 'development') {
        console.error('Request setup error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };