import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Move } from 'lucide-react';

const BubbleNote = ({ note, onEdit, onDelete, onMove, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(note.position);
  
  const startDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    onMove(note.id, true);
  };
  
  const handleDrag = (e, info) => {
    if (isDragging) {
      setPosition({
        x: position.x + info.delta.x,
        y: position.y + info.delta.y
      });
    }
  };
  
  const stopDrag = () => {
    setIsDragging(false);
    onMove(note.id, false, position);
  };
  
  return (
    <motion.div 
      className={`bubble-note-container ${selected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: selected ? 101 : 100,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag={selected}
      dragMomentum={false}
      onDragStart={startDrag}
      onDrag={handleDrag}
      onDragEnd={stopDrag}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bubble-note"
        style={{
          width: `${note.size.width}px`,
          minHeight: `${note.size.height}px`,
          backgroundColor: note.color,
          color: getContrastColor(note.color)
        }}
      >
        <div className="bubble-pointer" style={{ backgroundColor: note.color }}></div>
        <div className="bubble-content">{note.text}</div>
        
        {(isHovered || selected) && (
          <motion.div 
            className="bubble-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button 
              className="bubble-action-btn"
              onClick={() => onEdit(note.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 size={14} />
            </motion.button>
            <motion.button 
              className="bubble-action-btn delete-btn"
              onClick={() => onDelete(note.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={14} />
            </motion.button>
            {selected && (
              <div className="drag-indicator">
                <Move size={14} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BubbleNote;
