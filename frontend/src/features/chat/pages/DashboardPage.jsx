import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { fetchChats, getMessages, sendMessage } from '../services/chat.api';
import { setChats, setCurrentChatId, setMessages } from '../chat.slice';
import '../styles/dashboard.css'

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const chat = useChat();

  const newChats = useSelector(state => state.chat.chats);
  const currentChatId = useSelector(state => state.chat.currentChatId);

  const [inputValue, setInputValue] = useState('');
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    if (chat.socket) {
      console.log('Socket connected:', chat.socket.id)
    }

    // Load chats on mount
    const loadChats = async () => {
      try {
        const chats = await fetchChats();
        const chatsObj = {};
        chats.forEach(chat => chatsObj[chat._id] = chat);
        dispatch(setChats(chatsObj));
      } catch (error) {
        console.error('Failed to load chats:', error);
      }
    };
    loadChats();
  }, [chat.socket, dispatch])


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newChats[currentChatId]?.messages])

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage) return;
    
    chat.handleSendMessage({ chatId: currentChatId, message: trimmedMessage });

    setInputValue('');
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  console.log("Current Chats from Redux:", newChats);

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setInputValue('');
  }

  const handleChatSelect = async (chatId) => {
    dispatch(setCurrentChatId(chatId));
    try {
      const response = await getMessages(chatId);
      const fetchedMessages = response.messages;
      // Transform messages to match the expected format
      const transformedMessages = fetchedMessages.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: new Date(msg.createdAt)
      }));
      dispatch(setMessages({ chatId, messages: transformedMessages }));
    } catch (error) {
      console.error('Failed to load messages:', error);
      dispatch(setMessages({ chatId, messages: [] }));
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          ✨ New Chat
        </button>
        
        <div className="chats-list">
          <h3>Recent Chats</h3>
          {Object.values(newChats).map(chat => (
            <div 
              key={chat._id} 
              className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat._id)}
            >
              <div className="chat-item-title">{chat.title}</div>
              <div className="chat-item-preview">Conversation</div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="logo">🔍 Perplexity</div>
            <div className="user-message">
              {user?.name || 'User'} • Dashboard
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {(!currentChatId || !newChats[currentChatId]?.messages || newChats[currentChatId].messages.length === 0) ? (
            <div className="empty-state">
              <div className="empty-icon">💡</div>
              <h3>Start a new conversation</h3>
              <p>Ask me anything or explore topics by entering your question below</p>
            </div>
          ) : (
            newChats[currentChatId].messages.map(msg => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              className="message-input"
              placeholder="Ask something or type a command..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="2"
            />
            <button 
              className="send-btn" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              📤
            </button>
          </div>
          <div className="input-footer">
            <span className="shortcut-hint">Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage