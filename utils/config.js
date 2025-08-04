const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://moonshot-signals-backend-production.up.railway.app'  // Use Railway backend URL
      : 'http://localhost:5000'
  ),
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || (
    process.env.NODE_ENV === 'production'
      ? 'wss://moonshot-signals-backend-production.up.railway.app/ws'  // Use Railway backend URL
      : 'ws://localhost:5000'
  )
};

export default config;