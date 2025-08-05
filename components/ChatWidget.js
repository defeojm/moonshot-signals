import { useState, useEffect, useRef } from 'react';
import config from '../utils/config';

export default function ChatWidget({ user, token, ws }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when chat opens
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    console.log('Fetching messages with token:', token);
    
    try {
      const response = await fetch(`${config.API_URL}/chat/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Fetch messages response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        const error = await response.json();
        console.error('Failed to fetch messages:', response.status, error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    console.log('Sending message with token:', token);

    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
      } else {
        const error = await response.json();
        console.error('Failed to send message:', error);
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
    setIsLoading(false);
  };

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!ws) {
      console.log('No WebSocket connection available');
      return;
    }

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('User received WebSocket message:', data);
        
        if (data.type === 'chat_message_for_user') {
          console.log('Message is for user ID:', data.data.userId, 'Current user ID:', user.id);
          
          if (data.data.userId === user.id) {
            console.log('Adding message to chat:', data.data.message);
            setMessages(prev => [...prev, data.data.message]);
            
            // Show notification if chat is closed
            if (!isOpen && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New message from MoonShot support', {
                body: data.data.message.message,
                icon: '/favicon.ico'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws, user.id, isOpen]);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Chat Button - Fixed positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          left: 'auto',
          top: 'auto',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5e9eff 0%, #4a8af4 100%)',
          color: '#ffffff',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(94, 158, 255, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(94, 158, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(94, 158, 255, 0.4)';
        }}
      >
        <span style={{ animation: 'bounce 2s ease-in-out infinite' }}>💬</span>
        {messages.filter(m => m.is_admin && !m.read_by_user).length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ff5e5e',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: '700',
            minWidth: '20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(255, 94, 94, 0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            {messages.filter(m => m.is_admin && !m.read_by_user).length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '110px',
          right: '32px',
          left: 'auto',
          top: 'auto',
          width: '380px',
          height: '550px',
          backgroundColor: 'rgba(21, 25, 53, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          border: '1px solid #2a3456',
          animation: 'slideUp 0.3s ease-out',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          <div style={{
            padding: '1.25rem',
            borderBottom: '1px solid #2a3456',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(30, 36, 68, 0.5)',
            borderRadius: '16px 16px 0 0',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#ffffff',
              }}>VIP Support Chat</h3>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#64ffda',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#64ffda',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                }}></span>
                Online
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{
                background: 'none',
                border: 'none',
                color: '#8892b0',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(136, 146, 176, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8892b0';
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            scrollBehavior: 'smooth',
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👋</span>
                <p style={{
                  color: '#ffffff',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: 0,
                }}>Welcome to VIP Support!</p>
                <p style={{
                  color: '#8892b0',
                  fontSize: '0.875rem',
                  margin: 0,
                }}>How can we help you trade better today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    alignSelf: msg.is_admin ? 'flex-start' : 'flex-end',
                    flexDirection: msg.is_admin ? 'row' : 'row-reverse',
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  {msg.is_admin && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#5e9eff',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}>MS</div>
                  )}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}>
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      backgroundColor: msg.is_admin ? 'rgba(94, 158, 255, 0.1)' : '#1e2444',
                      color: '#ffffff',
                      border: msg.is_admin ? '1px solid rgba(94, 158, 255, 0.3)' : 'none',
                    }}>
                      {msg.message}
                    </div>
                    <div style={{
                      fontSize: '0.625rem',
                      color: '#5a6378',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                    }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={sendMessage} 
            style={{
              padding: '1rem',
              borderTop: '1px solid #2a3456',
              display: 'flex',
              gap: '0.75rem',
              background: 'rgba(30, 36, 68, 0.5)',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#1e2444',
                border: '2px solid #2a3456',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#5e9eff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2a3456';
              }}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: isLoading || !newMessage.trim() ? '#3a4a6b' : '#5e9eff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                opacity: isLoading || !newMessage.trim() ? 0.5 : 1,
              }}
              disabled={isLoading || !newMessage.trim()}
            >
              {isLoading ? '...' : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #5e9eff 0%, #4a8af4 100%)',
    color: '#ffffff',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(94, 158, 255, 0.4)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  chatIcon: {
    animation: 'bounce 2s ease-in-out infinite',
  },
  
  unreadBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#ff5e5e',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(255, 94, 94, 0.4)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  chatWindow: {
    position: 'fixed',
    bottom: '7rem',
    right: '2rem',
    width: '380px',
    height: '550px',
    backgroundColor: 'rgba(21, 25, 53, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    border: '1px solid #2a3456',
    animation: 'slideUp 0.3s ease-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  chatHeader: {
    padding: '1.25rem',
    borderBottom: '1px solid #2a3456',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(30, 36, 68, 0.5)',
    borderRadius: '16px 16px 0 0',
  },
  
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  chatTitle: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#64ffda',
  },
  
  statusDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#64ffda',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#8892b0',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'rgba(136, 146, 176, 0.1)',
      color: '#ffffff',
    }
  },
  
  messagesContainer: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    scrollBehavior: 'smooth',
  },
  
  welcomeMessage: {
    textAlign: 'center',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  welcomeIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  
  noMessages: {
    color: '#ffffff',
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: 0,
  },
  
  welcomeSubtext: {
    color: '#8892b0',
    fontSize: '0.875rem',
    margin: 0,
  },
  
  message: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '85%',
    wordWrap: 'break-word',
  },
  
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  
  adminMessage: {
    alignSelf: 'flex-start',
  },
  
  adminAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#5e9eff',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  messageContent: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    backgroundColor: '#1e2444',
    color: '#ffffff',
  },
  
  messageTime: {
    fontSize: '0.625rem',
    color: '#5a6378',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  },
  
  inputForm: {
    padding: '1rem',
    borderTop: '1px solid #2a3456',
    display: 'flex',
    gap: '0.75rem',
    background: 'rgba(30, 36, 68, 0.5)',
    borderRadius: '0 0 16px 16px',
  },
  
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    backgroundColor: '#1e2444',
    border: '2px solid #2a3456',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: '#5e9eff',
      backgroundColor: '#1e2444',
    },
    '&::placeholder': {
      color: '#5a6378',
    }
  },
  
  sendButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#5e9eff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    '&:hover': {
      backgroundColor: '#4a8af4',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(94, 158, 255, 0.3)',
    }
  },
  
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
    }
  },
  
  loadingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite',
  }
};