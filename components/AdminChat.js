import { useState, useEffect, useRef } from 'react';
import config from '../utils/config';

export default function AdminChat({ token, ws }) {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/chat/admin/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/chat/admin/messages/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message to user
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/chat/admin/messages/${selectedUser.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
        
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setIsLoading(false);
  };

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Admin received WebSocket message:', data); // Add this debug log
        
        if (data.type === 'new_chat_message') {
          // Refresh conversations to show new message
          fetchConversations();
          
          // If this user is currently selected, add message to view
          if (selectedUser && data.data.user_id === selectedUser.id) {
            fetchMessages(selectedUser.id);
          }
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New message from ${data.data.user.email}`, {
              body: data.data.message,
              icon: '/favicon.ico'
            });
          }
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [ws, selectedUser]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      {/* Conversations List */}
      <div style={styles.conversationsList}>
        <h3 style={styles.title}>VIP Member Chats</h3>
        {conversations.length === 0 ? (
          <p style={styles.noConversations}>No active conversations</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.user.id}
              style={{
                ...styles.conversationItem,
                ...(selectedUser?.id === conv.user.id ? styles.selectedConversation : {})
              }}
              onClick={() => {
                setSelectedUser(conv.user);
                fetchMessages(conv.user.id);
              }}
            >
              <div style={styles.conversationHeader}>
                <span style={styles.userName}>{conv.user.email}</span>
                {conv.unreadCount > 0 && (
                  <span style={styles.unreadBadge}>{conv.unreadCount}</span>
                )}
              </div>
              {conv.lastMessage && (
                <div style={styles.lastMessage}>
                  {conv.lastMessage.is_admin ? 'You: ' : ''}
                  {conv.lastMessage.message.substring(0, 50)}...
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {selectedUser ? (
          <>
            <div style={styles.chatHeader}>
              <h3>{selectedUser.email}</h3>
            </div>

            <div style={styles.messagesContainer}>
              {messages.map((msg, index) => (
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
              ))}
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
                {isLoading ? '...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div style={styles.selectUserPrompt}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    height: '600px',
    backgroundColor: '#151935',
    borderRadius: '12px',
    border: '1px solid #2a3456',
    overflow: 'hidden'
  },
  conversationsList: {
    borderRight: '1px solid #2a3456',
    padding: '1rem',
    overflowY: 'auto'
  },
  title: {
    marginBottom: '1rem',
    fontSize: '1.125rem'
  },
  noConversations: {
    color: '#8892b0',
    textAlign: 'center',
    padding: '2rem 0'
  },
  conversationItem: {
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    backgroundColor: '#1e2444'
  },
  selectedConversation: {
    backgroundColor: 'rgba(94, 158, 255, 0.2)',
    border: '1px solid rgba(94, 158, 255, 0.3)'
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem'
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  unreadBadge: {
    backgroundColor: '#ff5e5e',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '0.625rem',
    fontWeight: 'bold'
  },
  lastMessage: {
    fontSize: '0.75rem',
    color: '#8892b0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column'
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid #2a3456'
  },
  messagesContainer: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  },
  userMessage: {
    backgroundColor: '#1e2444',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  adminMessage: {
    backgroundColor: 'rgba(94, 158, 255, 0.1)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
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
    padding: '0.5rem 1.5rem',
    backgroundColor: '#5e9eff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  selectUserPrompt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#8892b0'
  }
};