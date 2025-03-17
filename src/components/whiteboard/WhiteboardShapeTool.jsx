// WhiteboardShapeTool.jsx - For drawing geometric shapes
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Square, Circle, Triangle, Hexagon, Star, Line } from 'lucide-react';

const WhiteboardShapeTool = ({ onSelect, onClose, color, size }) => {
  const [selectedShape, setSelectedShape] = useState(null);
  const [fillColor, setFillColor] = useState('transparent');
  const [hasFill, setHasFill] = useState(false);
  
  const shapes = [
    { id: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { id: 'triangle', icon: <Triangle size={20} />, label: 'Triangle' },
    { id: 'line', icon: <Line size={20} />, label: 'Line' },
    { id: 'hexagon', icon: <Hexagon size={20} />, label: 'Hexagon' },
    { id: 'star', icon: <Star size={20} />, label: 'Star' },
  ];
  
  const handleSelectShape = (shape) => {
    setSelectedShape(shape);
  };
  
  const handleApply = () => {
    if (selectedShape) {
      onSelect({
        type: selectedShape,
        strokeColor: color,
        strokeWidth: size,
        fillColor: hasFill ? fillColor : 'transparent'
      });
    }
    onClose();
  };
  
  const toggleFill = () => {
    setHasFill(!hasFill);
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <motion.div 
      className="shape-tool-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="shape-tool-header">
        <h3>Select Shape</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="shapes-grid">
        {shapes.map((shape) => (
          <motion.button
            key={shape.id}
            className={`shape-btn ${selectedShape === shape.id ? 'active' : ''}`}
            onClick={() => handleSelectShape(shape.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="shape-icon">{shape.icon}</div>
            <span className="shape-label">{shape.label}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="shape-properties">
        <div className="fill-option">
          <label>
            <input 
              type="checkbox" 
              checked={hasFill} 
              onChange={toggleFill} 
            />
            Fill Shape
          </label>
          
          {hasFill && (
            <input 
              type="color" 
              value={fillColor} 
              onChange={(e) => setFillColor(e.target.value)}
              className="fill-color-picker"
            />
          )}
        </div>
        
        <div className="stroke-preview">
          <div className="stroke-label">Stroke:</div>
          <div 
            className="stroke-color" 
            style={{ backgroundColor: color, height: `${size}px` }}
          ></div>
        </div>
      </div>
      
      <div className="shape-tool-footer">
        <button 
          className="cancel-btn" 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className="apply-btn" 
          onClick={handleApply}
          disabled={!selectedShape}
        >
          Apply
        </button>
      </div>
    </motion.div>
  );
};

export default WhiteboardShapeTool;