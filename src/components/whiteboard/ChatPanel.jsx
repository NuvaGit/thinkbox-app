// ChatPanel.jsx - For collaborator communication
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';

const ChatPanel = ({ collaborators, currentUser, onClose, visible }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: collaborators[0],
      text: "Hey everyone, let's brainstorm ideas for the new feature.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: 2,
      user: collaborators[1],
      text: "I was thinking we could add a timeline view.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      user: currentUser || {
        id: 0,
        name: 'You',
        color: '#4a6bff',
        avatar: 'https://via.placeholder.com/40'
      },
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="chat-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="chat-header">
            <div className="chat-title">
              <MessageCircle size={18} />
              <h3>Team Chat</h3>
            </div>
            <motion.button 
              className="close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`message ${message.user.id === (currentUser?.id || 0) ? 'own-message' : ''}`}
              >
                {message.user.id !== (currentUser?.id || 0) && (
                  <div 
                    className="message-avatar"
                    style={{ borderColor: message.user.color }}
                  >
                    <img src={message.user.avatar} alt={message.user.name} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">{message.user.name}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="chat-input"
            />
            <motion.button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;