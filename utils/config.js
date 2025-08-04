const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://getmoonshots.com'  // Remove /api
      : 'http://localhost:5000'      // Remove /api
  ),
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || (
    process.env.NODE_ENV === 'production'
      ? 'wss://getmoonshots.com/ws'
      : 'ws://localhost:5000'
  )
};