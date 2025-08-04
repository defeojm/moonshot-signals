// frontend/hooks/useWebSocket.js
import { useEffect, useState, useCallback, useRef } from 'react';
import config from '../utils/config';

export function useWebSocket(onMessage) {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    try {
      // Clear any existing connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token available for WebSocket connection');
        return;
      }

      // Add token to WebSocket URL
      const wsUrl = `${config.WS_URL}?token=${encodeURIComponent(token)}`;
      console.log('Connecting to WebSocket:', config.WS_URL); // Don't log the token
      
      const websocket = new WebSocket(wsUrl);
      wsRef.current = websocket;
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        // Clear reconnect timeout on successful connection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Send a ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // Ping every 30 seconds
        
        // Store interval ID for cleanup
        wsRef.current.pingInterval = pingInterval;
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          // Call the message handler with the parsed data
          if (onMessage) {
            onMessage(data);
          }
          
          // Log specific message types for debugging
          if (data.type === 'new_signal') {
            console.log('🚀 New signal detected:', data.data);
          } else if (data.type === 'connected') {
            console.log('🤝 Connection confirmed:', data.message);
          } else if (data.type === 'new_chat_message') {
            console.log('💬 New chat message:', data.data);
          } else if (data.type === 'chat_message_for_user') {
            console.log('💬 Chat message for user:', data.data);
          } else if (data.type === 'new_trade') {
            console.log('📊 New trade detected:', data.data);
          } else if (data.type === 'trade_update') {
            console.log('📊 Trade updated:', data.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          console.log('Raw message:', event.data);
        }
      };

      websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsConnected(false);
      };

      websocket.onclose = (event) => {
        console.log('❌ WebSocket disconnected', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);
        
        // Clear ping interval
        if (wsRef.current && wsRef.current.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        
        wsRef.current = null;
        
        // Only reconnect if we have a token and it wasn't a manual close
        if (localStorage.getItem('token') && event.code !== 1000) {
          // Reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      setWs(websocket);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      // Retry connection after 3 seconds if we have a token
      if (localStorage.getItem('token')) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    }
  }, [onMessage]);

  useEffect(() => {
    // Only connect if we have a token
    if (localStorage.getItem('token')) {
      connect();
    }

    // Listen for storage events (login/logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (e.newValue) {
          // Token was added, connect
          connect();
        } else {
          // Token was removed, disconnect
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close(1000, 'Logged out');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      window.removeEventListener('storage', handleStorageChange);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        if (wsRef.current.pingInterval) {
          clearInterval(wsRef.current.pingInterval);
        }
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component unmounted');
        }
      }
    };
  }, [connect]);

  // Add a send method for future use
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  }, []);

  // Return the WebSocket instance reference
  return { 
    isConnected, 
    ws: wsRef.current,  // Return the actual WebSocket instance
    sendMessage 
  };
}