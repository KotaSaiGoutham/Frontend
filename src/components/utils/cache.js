// src/utils/cache.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const cacheService = {
  set: (key, data) => {
    if (!IS_DEVELOPMENT) return; // Only cache in development
    
    try {
      const cacheData = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(`dev-cache-${key}`, JSON.stringify(cacheData));
      console.log('💾 Cached:', key);
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  },

  get: (key) => {
    if (!IS_DEVELOPMENT) return null; // Only use cache in development
    
    try {
      const cached = localStorage.getItem(`dev-cache-${key}`);
      if (!cached) return null;
      
      const { timestamp, data } = JSON.parse(cached);
      
      // Check if cache expired
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(`dev-cache-${key}`);
        console.log('⏰ Cache expired:', key);
        return null;
      }
      
      console.log('📦 Serving from cache:', key);
      return data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  },

  clear: (key) => {
    try {
      localStorage.removeItem(`dev-cache-${key}`);
      console.log('🗑️ Cache cleared:', key);
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  },

  // Development only - view all cached data
  debug: () => {
    if (!IS_DEVELOPMENT) return;
    
    const cacheData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('dev-cache-')) {
        cacheData[key] = localStorage.getItem(key);
      }
    }
    console.log('🔍 Cache Debug:', cacheData);
  }
};