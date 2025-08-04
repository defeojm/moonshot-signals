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

      const websocket = new WebSocket(config.WS_URL);
      wsRef.current = websocket;
      
      websocket.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        // Clear reconnect timeout on successful connection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
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
        wsRef.current = null;
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 3000);
      };

      setWs(websocket);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      // Retry connection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [onMessage]);

  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
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