// src/services/cachedApiService.js
import { cacheService } from '../utils/cache';

export const cachedApiService = {
  get: async (cacheKey, apiCall, forceRefresh = false) => {
    // Return cached data if available
    if (!forceRefresh) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch fresh data
    console.log('🔄 Fetching fresh data from Firebase:', cacheKey);
    const data = await apiCall();
    
    // Cache the fresh data
    cacheService.set(cacheKey, data);
    
    return data;
  },

  clear: (cacheKey) => {
    cacheService.clear(cacheKey);
  },

  // Clear all development cache
  clearAll: () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('dev-cache-')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 Cleared all development cache');
  },

  // Development debug helper
  debug: () => {
    cacheService.debug();
  }
};