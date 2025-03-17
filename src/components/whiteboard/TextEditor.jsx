
// TextEditor.jsx - For adding and editing text on the whiteboard
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

const TextEditor = ({ position, onClose, onSave, initialText = '', contextRef, canvasRef }) => {
  const [text, setText] = useState(initialText);
  const [style, setStyle] = useState({
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000'
  });
  const editorRef = useRef(null);
  
  useEffect(() => {
    // Focus the editor on mount
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  
  const handleSave = () => {
    if (!text.trim()) {
      onClose();
      return;
    }
    
    // Render text to canvas
    if (contextRef.current && canvasRef.current) {
      const context = contextRef.current;
      
      // Save current context state
      context.save();
      
      // Apply text styles
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.fillStyle = style.color;
      context.textAlign = style.textAlign;
      
      // Calculate text position
      let x = position.x;
      if (style.textAlign === 'center') {
        x = position.x;
      } else if (style.textAlign === 'right') {
        x = position.x;
      }
      
      // Split text into lines and render each line
      const lineHeight = parseInt(style.fontSize) * 1.2;
      const lines = text.split('\n');
      
      lines.forEach((line, index) => {
        context.fillText(line, x, position.y + (index * lineHeight));
      });
      
      // Restore context state
      context.restore();
      
      // Return text object for undo/redo functionality
      onSave({
        type: 'text',
        text,
        style,
        position
      });
    }
    
    onClose();
  };
  
  const toggleBold = () => {
    setStyle(prev => ({
      ...prev,
      fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold'
    }));
  };
  
  const toggleItalic = () => {
    setStyle(prev => ({
      ...prev,
      fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic'
    }));
  };
  
  const changeAlignment = (alignment) => {
    setStyle(prev => ({
      ...prev,
      textAlign: alignment
    }));
  };
  
  const changeFontSize = (e) => {
    setStyle(prev => ({
      ...prev,
      fontSize: `${e.target.value}px`
    }));
  };
  
  const changeColor = (e) => {
    setStyle(prev => ({
      ...prev,
      color: e.target.value
    }));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };
  
  return (
    <motion.div 
      className="text-editor"
      style={{ 
        position: 'absolute', 
        left: position.x, 
        top: position.y,
        zIndex: 150
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="text-editor-toolbar">
        <button 
          className={`formatting-btn ${style.fontWeight === 'bold' ? 'active' : ''}`}
          onClick={toggleBold}
        >
          <Bold size={16} />
        </button>
        <button 
          className={`formatting-btn ${style.fontStyle === 'italic' ? 'active' : ''}`}
          onClick={toggleItalic}
        >
          <Italic size={16} />
        </button>
        <div className="separator" />
        <button 
          className={`formatting-btn ${style.textAlign === 'left' ? 'active' : ''}`}
          onClick={() => changeAlignment('left')}
        >
          <AlignLeft size={16} />
        </button>
        <button 
          className={`formatting-btn ${style.textAlign === 'center' ? 'active' : ''}`}
          onClick={() => changeAlignment('center')}
        >
          <AlignCenter size={16} />
        </button>
        <button 
          className={`formatting-btn ${style.textAlign === 'right' ? 'active' : ''}`}
          onClick={() => changeAlignment('right')}
        >
          <AlignRight size={16} />
        </button>
        <div className="separator" />
        <select 
          value={parseInt(style.fontSize)} 
          onChange={changeFontSize}
          className="font-size-selector"
        >
          {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <input 
          type="color" 
          value={style.color} 
          onChange={changeColor}
          className="color-picker-mini"
        />
      </div>
      
      <textarea
        ref={editorRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          textAlign: style.textAlign,
          color: style.color
        }}
        placeholder="Type your text here..."
      />
      
      <div className="text-editor-footer">
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSave}>
          Add Text
        </button>
      </div>
    </motion.div>
  );
};

export default TextEditor;