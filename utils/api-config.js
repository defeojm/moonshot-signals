// utils/api-config.js
// Centralized API configuration

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moonshot-signals-backend-production.up.railway.app';

// Helper to build API URLs
export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_URL}${path}`;
};

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    
    // Admin
    MEMBERS: '/api/members',
    STATS: '/api/stats',
    
    // Trades & Signals
    TRADES: '/api/trades',
    SIGNALS: '/api/signals',
    SIGNALS_ALL: '/api/signals/all',
    PUBLISH_SIGNAL: '/api/signals/publish',
    
    // Settings
    USER_SETTINGS: '/api/settings',
    NOTIFICATIONS: '/api/settings/notifications',
    
    // Chat
    CHAT_MESSAGES: '/api/chat/messages',
};

export default API_URL;
