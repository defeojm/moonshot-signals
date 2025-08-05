const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://moonshot-signals-backend-production.up.railway.app',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://moonshot-signals-backend-production.up.railway.app/ws'
};

export default config;