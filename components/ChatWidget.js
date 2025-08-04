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
      const response = await fetch(`${config.API_URL}/api/chat/messages`, {
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
      const response = await fetch(`${config.API_URL}/api/chat/messages`, {
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
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.chatButton}
      >
        💬
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
            <h3>VIP Support Chat</h3>
            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>×</button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <p style={styles.noMessages}>Start a conversation with your trading coach!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    ...(msg.is_admin ? styles.adminMessage : styles.userMessage)
                  }}
                >
                  <div style={styles.messageContent}>{msg.message}</div>
                  <div style={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString()}
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
            <button type="submit" style={styles.sendButton} disabled={isLoading}>
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
    backgroundColor: '#5e9eff',
    color: 'white',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(94, 158, 255, 0.4)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  unreadBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#ff5e5e',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  chatWindow: {
    position: 'fixed',
    bottom: '7rem',
    right: '2rem',
    width: '350px',
    height: '500px',
    backgroundColor: '#151935',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    border: '1px solid #2a3456'
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid #2a3456',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#8892b0',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  messagesContainer: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  noMessages: {
    textAlign: 'center',
    color: '#8892b0',
    padding: '2rem'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    maxWidth: '80%',
    wordWrap: 'break-word'
  },
  userMessage: {
    backgroundColor: '#1e2444',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  adminMessage: {
    backgroundColor: 'rgba(94, 158, 255, 0.1)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
    border: '1px solid rgba(94, 158, 255, 0.3)'
  },
  messageContent: {
    fontSize: '0.875rem',
    lineHeight: '1.4'
  },
  messageTime: {
    fontSize: '0.625rem',
    color: '#8892b0',
    marginTop: '0.25rem'
  },
  inputForm: {
    padding: '1rem',
    borderTop: '1px solid #2a3456',
    display: 'flex',
    gap: '0.5rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#1e2444',
    border: '1px solid #2a3456',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem'
  },
  sendButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#5e9eff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};