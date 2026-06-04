import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';
const SOCKET_URL = API || 'http://localhost:5000';

export default function Chat() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, []);

  // Initialize Socket.io
  useEffect(() => {
    if (!user) return;

    console.log('Connecting to:', SOCKET_URL);
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      setIsConnected(true);
      const token = localStorage.getItem('token');
      console.log('Sending join with token:', token ? 'Token exists' : 'No token');
      newSocket.emit('join', token);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('✅ Authenticated as:', data.username);
    });

    newSocket.on('newMessage', (message) => {
      console.log('📩 New message:', message);
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('onlineUsers', (users) => {
      console.log('👥 Online users:', users);
      setOnlineUsers(users);
    });

    newSocket.on('userTyping', (username) => {
      setTyping(username);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTyping(''), 3000);
    });

    newSocket.on('userStopTyping', () => {
      setTyping('');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('sendMessage', { message: inputMessage.trim() });
    setInputMessage('');
    socket.emit('stopTyping');
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    if (!socket) return;

    socket.emit('typing');
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping');
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        <div>
          <p style={{ margin: '0 0 4px', color: '#9f3518', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</p>
          <h1 style={{ margin: 0, color: '#1a1815', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.04em', fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>
            Chat Room
          </h1>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '999px', background: isConnected ? '#ddf2e2' : '#f8dfda',
          border: `1px solid ${isConnected ? 'rgba(159,53,24,0.2)' : 'rgba(159,53,24,0.3)'}`,
        }}>
          <Users size={16} color={isConnected ? '#2e7d32' : '#d32f2f'} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isConnected ? '#2e7d32' : '#d32f2f' }}>
            {onlineUsers.length} online
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px', background: '#fff',
        borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)',
        marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6f665d' }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId?._id === user?._id || msg.userId === user?._id;
            return (
              <div key={msg._id} style={{
                display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px'
              }}>
                {!isMe && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d95f39, #9f3518)',
                    display: 'grid', placeItems: 'center', color: '#fff',
                    fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
                  }}>
                    {msg.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth: '60%' }}>
                  {!isMe && <p style={{ margin: '0 0 4px 8px', fontSize: '0.75rem', color: '#6f665d' }}>{msg.username}</p>}
                  <div style={{
                    padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMe ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(0,0,0,0.05)',
                    color: isMe ? '#fff' : '#1a1815', wordBreak: 'break-word'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.message}</p>
                  </div>
                  <p style={{ margin: '4px 0 0 8px', fontSize: '0.7rem', color: '#9f9488' }}>{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typing && (
        <div style={{ padding: '0 20px 8px', fontSize: '0.85rem', color: '#6f665d', fontStyle: 'italic' }}>
          {typing} is typing...
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} style={{
        display: 'flex', gap: '12px', padding: '12px',
        background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.08)'
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          disabled={!isConnected}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.08)', outline: 'none',
            background: '#f5f5f5', fontSize: '0.95rem'
          }}
        />
        <button type="submit" disabled={!inputMessage.trim() || !isConnected} style={{
          padding: '12px 24px', borderRadius: '14px', border: 'none',
          background: inputMessage.trim() && isConnected ? 'linear-gradient(135deg, #d95f39, #9f3518)' : '#ccc',
          color: '#fff', fontWeight: 600, cursor: inputMessage.trim() && isConnected ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
        }}>
          <Send size={16} />
          Send
        </button>
      </form>
    </div>
  );
}
