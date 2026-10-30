import axios from 'axios';

export function useApi() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 15000
  });

  // Request interceptor to add token
  api.interceptors.request.use(
    async (config) => {
      try {
        // Wait for Clerk to be available
        let attempts = 0;
        while (!window.Clerk && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Clerk) {
          console.error('❌ Clerk not loaded');
          throw new Error('Clerk not loaded');
        }

        if (!window.Clerk.session) {
          console.error('❌ No Clerk session found');
          throw new Error('Please sign in first');
        }

        // Get token from Clerk
        const token = await window.Clerk.session.getToken();
        
        if (!token) {
          console.error('❌ Failed to get token');
          throw new Error('Authentication failed - please sign in again');
        }

        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request');
        
      } catch (error) {
        console.error('❌ Token error:', error.message);
        throw error;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}
