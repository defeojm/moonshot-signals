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
    console.log('Fetching messages with token:', token); // Add this line
    
    try {
      const response = await fetch(`${config.API_URL}/chat/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Fetch messages response:', response.status); // Add this line
      
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

    console.log('Sending message with token:', token); // Add this line

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
      
      console.log('Response status:', response.status); // Add this line
      
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
        console.log('User received WebSocket message:', data); // Add debug log
        
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
      <style jsx>{`
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

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.chatButton}
      >
        <span style={styles.chatIcon}>💬</span>
        {messages.filter(m => m.is_admin && !m.read_by_user).length > 0 && (
          <span style={styles.unreadBadge}>
            {messages.filter(m => m.is_admin && !m.read_by_user).length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <div style={styles.headerLeft}>
              <h3 style={styles.chatTitle}>VIP Support Chat</h3>
              <span style={styles.statusIndicator}>
                <span style={styles.statusDot}></span>
                Online
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.welcomeMessage}>
                <span style={styles.welcomeIcon}>👋</span>
                <p style={styles.noMessages}>Welcome to VIP Support!</p>
                <p style={styles.welcomeSubtext}>How can we help you trade better today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    ...(msg.is_admin ? styles.adminMessage : styles.userMessage),
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  {msg.is_admin && (
                    <div style={styles.adminAvatar}>MS</div>
                  )}
                  <div style={styles.messageWrapper}>
                    <div style={styles.messageContent}>{msg.message}</div>
                    <div style={styles.messageTime}>
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

          <form onSubmit={sendMessage} style={styles.inputForm}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={styles.input}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              style={{
                ...styles.sendButton,
                ...(isLoading || !newMessage.trim() ? styles.sendButtonDisabled : {})
              }} 
              disabled={isLoading || !newMessage.trim()}
            >
              {isLoading ? (
                <span style={styles.loadingDot}></span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10L17 2L13 10L17 18L2 10Z" fill="currentColor"/>
                </svg>
              )}
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
    position: 'relative',
    transition: 'all 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 6px 30px rgba(94, 158, 255, 0.6)',
    }
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