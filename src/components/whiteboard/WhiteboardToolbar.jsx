// WhiteboardToolbar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Eraser, Hand, Type, Image, Square, Circle, 
  Trash2, Undo, Redo, Download, Share2, ZoomIn, ZoomOut, 
  Layers, Eye, Moon, Sun, ChevronDown
} from 'lucide-react';

const WhiteboardToolbar = ({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  saveWhiteboard,
  zoom,
  setZoom,
  resetView,
  activeTool,
  canvasMode,
  setCanvasMode
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [theme, setTheme] = useState('light');
  const [expandedSection, setExpandedSection] = useState(null);
  
  const tools = [
    { id: 'pen', icon: <Pencil size={20} />, label: 'Pen' },
    { id: 'eraser', icon: <Eraser size={20} />, label: 'Eraser' },
    { id: 'text', icon: <Type size={20} />, label: 'Text' },
    { id: 'image', icon: <Image size={20} />, label: 'Image' },
    { id: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { id: 'pan', icon: <Hand size={20} />, label: 'Pan' },
  ];
  
  
  const predefinedColors = [
    '#000000', // Black
    '#ffffff', // White
    '#ff3b30', // Red
    '#4cd964', // Green
    '#007aff', // Blue
    '#ffcc00', // Yellow
    '#ff9500', // Orange
    '#5856d6', // Purple
    '#ff2d55', // Pink
    '#5ac8fa', // Light Blue
  ];
  
  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };
  
  return (
    <div className={`whiteboard-toolbar ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Tools Section */}
      <div className="toolbar-section tools-section">
        <motion.div 
          className="section-header"
          onClick={() => toggleSection('tools')}
          whileHover={{ backgroundColor: theme === 'dark' ? '#3a3a3c' : '#f0f0f0' }}
        >
          <span>Tools</span>
          <ChevronDown 
            size={16} 
            className={expandedSection === 'tools' ? 'rotated' : ''}
          />
        </motion.div>
        
        <AnimatePresence>
          {(expandedSection === 'tools' || expandedSection === null) && (
            <motion.div 
              className="tools-grid"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tools.map((t) => (
                <motion.button
                  key={t.id}
                  className={`tool-btn ${tool === t.id ? 'active' : ''} ${activeTool === t.id ? 'animating' : ''}`}
                  onClick={() => setTool(t.id)}
                  title={t.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tool-icon">{t.icon}</span>
                  <span className="tool-label">{t.label}</span>
                  
                  {/* Tool selection indicator animation */}
                  {(tool === t.id || activeTool === t.id) && (
                    <motion.div 
                      className="tool-indicator"
                      layoutId="toolIndicator"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Style Section (Color & Size) */}
      <div className="toolbar-section style-section">
        <motion.div 
          className="section-header"
          onClick={() => toggleSection('style')}
          whileHover={{ backgroundColor: theme === 'dark' ? '#3a3a3c' : '#f0f0f0' }}
        >
          <span>Style</span>
          <ChevronDown 
            size={16} 
            className={expandedSection === 'style' ? 'rotated' : ''}
          />
        </motion.div>
        
        <AnimatePresence>
          {(expandedSection === 'style' || expandedSection === null) && (
            <motion.div 
              className="style-controls"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Color picker */}
              <div className="color-picker">
                <motion.button
                  className="color-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  title="Color"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 8px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                />
                
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div 
                      className="color-picker-dropdown"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="predefined-colors">
                        {predefinedColors.map((c) => (
                          <motion.button
                            key={c}
                            className={`predefined-color ${c === color ? 'active' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => {
                              setColor(c);
                              setShowColorPicker(false);
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                      
                      <div className="custom-color-input">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="color-input"
                        />
                        <span>Custom</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Size picker */}
              <div className="size-picker">
                <motion.button
                  className="size-btn"
                  onClick={() => setShowSizeSlider(!showSizeSlider)}
                  title="Brush Size"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="size-preview"
                    style={{
                      width: `${Math.min(size, 20)}px`,
                      height: `${Math.min(size, 20)}px`
                    }}
                  />
                </motion.button>
                
                <AnimatePresence>
                  {showSizeSlider && (
                    <motion.div 
                      className="size-slider-dropdown"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="size-slider"
                      />
                      
                      <div className="size-preview-container">
                        <div 
                          className="dynamic-size-preview"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`
                          }}
                        />
                        <span className="size-value">{size}px</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Actions Section */}
      <div className="toolbar-section actions-section">
        <motion.div 
          className="section-header"
          onClick={() => toggleSection('actions')}
          whileHover={{ backgroundColor: theme === 'dark' ? '#3a3a3c' : '#f0f0f0' }}
        >
          <span>Actions</span>
          <ChevronDown 
            size={16} 
            className={expandedSection === 'actions' ? 'rotated' : ''}
          />
        </motion.div>
        
        <AnimatePresence>
          {(expandedSection === 'actions' || expandedSection === null) && (
            <motion.div 
              className="action-buttons"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="action-btn"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                whileHover={{ scale: canUndo ? 1.1 : 1 }}
                whileTap={{ scale: canUndo ? 0.95 : 1 }}
              >
                <Undo size={20} />
                <span>Undo</span>
              </motion.button>
              
              <motion.button
                className="action-btn"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                whileHover={{ scale: canRedo ? 1.1 : 1 }}
                whileTap={{ scale: canRedo ? 0.95 : 1 }}
              >
                <Redo size={20} />
                <span>Redo</span>
              </motion.button>
              
              <motion.button
                className="action-btn clear-btn"
                onClick={clearCanvas}
                title="Clear Canvas (Ctrl+C)"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={20} />
                <span>Clear</span>
              </motion.button>
              
              <motion.button
                className="action-btn"
                onClick={saveWhiteboard}
                title="Save as Image"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                <span>Save</span>
              </motion.button>
              
              <motion.button
                className="action-btn"
                title="Share Whiteboard"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                <span>Share</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* View Section */}
      <div className="toolbar-section view-section">
        <motion.div 
          className="section-header"
          onClick={() => toggleSection('view')}
          whileHover={{ backgroundColor: theme === 'dark' ? '#3a3a3c' : '#f0f0f0' }}
        >
          <span>View</span>
          <ChevronDown 
            size={16} 
            className={expandedSection === 'view' ? 'rotated' : ''}
          />
        </motion.div>
        
        <AnimatePresence>
          {(expandedSection === 'view' || expandedSection === null) && (
            <motion.div 
              className="view-controls"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="canvas-mode-selector">
                <motion.button
                  className={`mode-btn ${canvasMode === 'draw' ? 'active' : ''}`}
                  onClick={() => setCanvasMode('draw')}
                  title="Draw Mode"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Pencil size={16} />
                  <span>Draw</span>
                </motion.button>
                
                <motion.button
                  className={`mode-btn ${canvasMode === 'view' ? 'active' : ''}`}
                  onClick={() => setCanvasMode('view')}
                  title="View Mode"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} />
                  <span>View</span>
                </motion.button>
                
                <motion.button
                  className={`mode-btn ${canvasMode === 'present' ? 'active' : ''}`}
                  onClick={() => setCanvasMode('present')}
                  title="Presentation Mode"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layers size={16} />
                  <span>Present</span>
                </motion.button>
              </div>
              
              <div className="zoom-controls-mini">
                <motion.button
                  onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                  title="Zoom Out (Ctrl+-)"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomOut size={16} />
                </motion.button>
                
                <span className="zoom-level-mini">{Math.round(zoom * 100)}%</span>
                
                <motion.button
                  onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
                  title="Zoom In (Ctrl++)"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomIn size={16} />
                </motion.button>
                
                <motion.button
                  onClick={resetView}
                  title="Reset View (Ctrl+0)"
                  className="reset-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
              </div>
              
              <motion.button
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ rotate: { duration: 0.5 } }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;