import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor - Add Clerk session token
api.interceptors.request.use(
  async (config) => {
    try {
      // Wait for Clerk to be ready
      let attempts = 0;
      while (!window.Clerk && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.Clerk) {
        console.warn('⚠️ Clerk not loaded');
        return config;
      }

      if (!window.Clerk.session) {
        console.warn('⚠️ No active Clerk session');
        return config;
      }

      // Get the session ID (this is what we need to send)
      const sessionId = window.Clerk.session.id;
      
      if (!sessionId) {
        console.warn('⚠️ No session ID available');
        return config;
      }

      // Add session ID as Bearer token
      config.headers.Authorization = `Bearer ${sessionId}`;
      console.log('✅ Session ID added to request');
      
    } catch (error) {
      console.error('❌ Error adding auth token:', error.message);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔒 Authentication failed');
      
      const errorMsg = error.response?.data?.message || 'Session expired';
      
      // Show error and redirect
      setTimeout(() => {
        alert(`Authentication Error: ${errorMsg}\n\nYou will be redirected to login.`);
        window.location.href = '/login';
      }, 100);
    } else if (error.response?.status === 403) {
      const errorMsg = error.response?.data?.message || 'You do not have permission';
      alert(`Permission Denied: ${errorMsg}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;
