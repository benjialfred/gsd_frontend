import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle Token Expiration and Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');
      
      if (refreshToken) {
        try {
          // Attempt to refresh token using standard endpoint
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newAccess = res.data.access;
          localStorage.setItem('access', newAccess);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid -> force logout
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
