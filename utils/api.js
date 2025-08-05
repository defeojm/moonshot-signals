// utils/api.js
// Fixed API configuration for your frontend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moonshot-signals-backend-production.up.railway.app';

// Helper to ensure URLs are properly formed
const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

// Fetch wrapper with authentication
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

// API methods
export const api = {
  // Auth
  login: (email, password) => 
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  // Admin endpoints  
  getMembers: () => apiFetch('/api/members'),
  getSignals: () => apiFetch('/api/signals'),
  getStats: () => apiFetch('/api/stats'),
  getTrades: () => apiFetch('/api/trades'),
  
  // Signal management
  createSignal: (data) => 
    apiFetch('/api/signals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateSignal: (id, data) =>
    apiFetch(`/api/signals/${id}`, {
      method: 'PUT', 
      body: JSON.stringify(data),
    }),
};

export default api;