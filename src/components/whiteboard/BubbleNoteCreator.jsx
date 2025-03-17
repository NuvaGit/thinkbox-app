import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Edit3, X, Check } from 'lucide-react';

const BubbleNoteCreator = ({ position, onSave, onCancel, color = '#4a6bff' }) => {
  const [text, setText] = useState('');
  const [noteSize, setNoteSize] = useState({ width: 200, height: 100 });
  const [isEditing, setIsEditing] = useState(true);
  const inputRef = useRef(null);
  const noteRef = useRef(null);
  
  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Adjust height based on content
  useEffect(() => {
    if (noteRef.current) {
      const scrollHeight = noteRef.current.scrollHeight;
      if (scrollHeight > 100) {
        setNoteSize(prev => ({ ...prev, height: Math.min(scrollHeight, 300) }));
      }
    }
  }, [text]);
  
  const handleSave = () => {
    if (text.trim()) {
      onSave({
        type: 'bubble',
        text,
        position,
        color,
        size: noteSize
      });
    } else {
      onCancel();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };
  
  return (
    <motion.div 
      className="bubble-note-creator"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div 
        className="bubble-note"
        style={{
          width: `${noteSize.width}px`,
          minHeight: `${noteSize.height}px`,
          backgroundColor: color,
          color: getContrastColor(color)
        }}
      >
        <div className="bubble-pointer" style={{ backgroundColor: color }}></div>
        
        <textarea
          ref={inputRef}
          className="bubble-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note..."
          style={{ color: getContrastColor(color) }}
        />
        
        <div className="bubble-controls">
          <motion.button 
            className="bubble-btn cancel-btn"
            onClick={onCancel}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ color: getContrastColor(color) }}
          >
            <X size={16} />
          </motion.button>
          <motion.button 
            className="bubble-btn save-btn"
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!text.trim()}
            style={{ color: getContrastColor(color) }}
          >
            <Check size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to determine text color based on background
function getContrastColor(hexColor) {
  // Convert hex to RGB
  hexColor = hexColor.replace('#', '');
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default BubbleNoteCreator;

