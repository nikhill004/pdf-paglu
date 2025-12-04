// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';

// In development, Vite proxy handles /api requests
// In production, use the full backend URL
export const getApiUrl = (endpoint) => {
  if (import.meta.env.DEV) {
    return endpoint; // Use Vite proxy in development
  }
  return `${API_URL}${endpoint}`;
};
