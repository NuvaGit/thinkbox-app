import React, { useState } from 'react';

const WhiteboardToolbar = ({ 
  tool, 
  setTool, 
  color, 
  setColor, 
  size, 
  setSize, 
  clearCanvas, 
  undo, 
  canUndo 
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  
  const tools = [
    { id: 'pen', icon: '✏️', label: 'Pen' },
    { id: 'eraser', icon: '🧽', label: 'Eraser' },
    // More tools can be added here in the future
  ];
  
  const predefinedColors = [
    '#000000', // Black
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
  ];
  
  return (
    <div className="whiteboard-toolbar">
      <div className="toolbar-section tools">
        {tools.map((t) => (
          <button
            key={t.id}
            className={`tool-btn ${tool === t.id ? 'active' : ''}`}
            onClick={() => setTool(t.id)}
            title={t.label}
          >
            <span className="tool-icon">{t.icon}</span>
          </button>
        ))}
      </div>
      
      <div className="toolbar-section color-picker">
        <button 
          className="color-btn"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Color"
        />
        
        {showColorPicker && (
          <div className="color-picker-dropdown">
            <div className="predefined-colors">
              {predefinedColors.map((c) => (
                <button
                  key={c}
                  className={`predefined-color ${c === color ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setColor(c);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
            
            <div className="custom-color-input">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <span>Custom</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="toolbar-section size-picker">
        <button 
          className="size-btn"
          onClick={() => setShowSizeSlider(!showSizeSlider)}
          title="Brush Size"
        >
          <div 
            className="size-preview" 
            style={{ 
              width: `${Math.min(size, 20)}px`, 
              height: `${Math.min(size, 20)}px` 
            }}
          />
        </button>
        
        {showSizeSlider && (
          <div className="size-slider-dropdown">
            <input
              type="range"
              min="1"
              max="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
            />
            <span className="size-value">{size}px</span>
          </div>
        )}
      </div>
      
      <div className="toolbar-section actions">
        <button 
          className="action-btn"
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          ↩️
        </button>
        
        <button 
          className="action-btn clear-btn"
          onClick={clearCanvas}
          title="Clear All"
        >
          🗑️
        </button>
      </div>
      
      <div className="toolbar-section file-actions">
        <button className="file-btn" title="Save">
          💾
        </button>
        
        <button className="file-btn" title="Share">
          📤
        </button>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;