import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Users, Share2, Download, Zap, Image, FileText, ChevronRight, Settings } from 'lucide-react';
import '../../styles/Whiteboard.css';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  // New state variables for enhanced features
  const [activeTool, setActiveTool] = useState(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [canvasMode, setCanvasMode] = useState('draw'); // 'draw', 'view', 'present'
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [lastAction, setLastAction] = useState({ type: null, timestamp: null });
  const canvasContainerRef = useRef(null);
  
  // Mock collaborators data (would come from your backend in a real app)
  const collaborators = [
    { id: 1, name: 'Alex Chen', avatar: 'https://via.placeholder.com/40', color: '#FF5733', active: true },
    { id: 2, name: 'Maya Johnson', avatar: 'https://via.placeholder.com/40', color: '#33A8FF', active: true },
    { id: 3, name: 'Theo Williams', avatar: 'https://via.placeholder.com/40', color: '#33FF57', active: false },
  ];

  // Initialize canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set up high-resolution canvas for retina displays
    const dpr = window.devicePixelRatio || 1;
    // Make it visually fill the positioned parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Get container dimensions for proper sizing
    const container = canvas.parentElement;
    const { width, height } = container.getBoundingClientRect();
    
    // Set the internal size to match with DPR adjustment
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Get context and scale for DPR
    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = size;
    contextRef.current = context;
    
    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    // Handle window resize
    const handleResize = () => {
      // Store current image
      const imageData = context.getImageData(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      // Update canvas dimensions
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Scale context for DPR
      context.scale(dpr, dpr);
      
      // Restore settings
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = size;
      
      // Restore the image
      context.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        clearCanvas();
      } else if (e.key === '+' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setZoom(prev => Math.min(prev + 0.1, 3));
      } else if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setZoom(prev => Math.max(prev - 0.1, 0.5));
      } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update canvas settings when color or size changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = size;
    }
  }, [color, size]);

  // Apply zoom and pan on canvas container
  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    if (canvasContainer) {
      canvasContainer.style.transform = `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`;
    }
  }, [zoom, panOffset]);

  // Save current canvas state to history
  const saveToHistory = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    const imageData = context.getImageData(
      0, 0, 
      canvas.width / dpr, 
      canvas.height / dpr
    );
    
    setHistory(prev => [...prev, imageData]);
    // Clear redo stack when new action is performed
    setRedoStack([]);
    
    // Record last action for animation feedback
    setLastAction({ 
      type: 'draw', 
      timestamp: new Date().getTime() 
    });
  };

  // Start drawing
  const startDrawing = (e) => {
    if (canvasMode !== 'draw' || isPanning) return;
    
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    
    if (tool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineWidth = size * 2;
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = size;
    }
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    
    // Save state before drawing
    saveToHistory();
  };

  // Get canvas coordinates from mouse or touch event
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const offsetX = (e.clientX || (e.touches && e.touches[0].clientX) || 0) - rect.left;
    const offsetY = (e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top;
    
    return { offsetX, offsetY };
  };

  // Draw
  const draw = (e) => {
    if (!isDrawing || canvasMode !== 'draw') return;
    
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    
    // Update cursor position for collaborative cursors
    setCursorPosition({ 
      x: offsetX, 
      y: offsetY 
    });
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    
    // Broadcast drawing data to collaborators (mock function)
    broadcastDrawingData({
      x: offsetX,
      y: offsetY,
      color,
      size,
      tool,
      type: 'drawing'
    });
  };

  // Finish drawing
  const finishDrawing = () => {
    if (!isDrawing) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Save current state to history before clearing
    saveToHistory();
    
    // Clear with animation
    setLastAction({ 
      type: 'clear', 
      timestamp: new Date().getTime() 
    });
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    // Broadcast clear action to collaborators
    broadcastDrawingData({
      type: 'clear'
    });
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0 || !canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Get current state to add to redo stack
    const currentState = context.getImageData(0, 0, canvas.width / dpr, canvas.height / dpr);
    setRedoStack(prev => [...prev, currentState]);
    
    // Get previous state from history
    const lastState = history[history.length - 1];
    context.putImageData(lastState, 0, 0);
    
    // Update history
    setHistory(prev => prev.slice(0, -1));
    
    setLastAction({ 
      type: 'undo', 
      timestamp: new Date().getTime() 
    });
    
    // Broadcast undo action
    broadcastDrawingData({
      type: 'undo'
    });
  };

  // Redo last undone action
  const handleRedo = () => {
    if (redoStack.length === 0 || !canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Get current state to add to history
    const currentState = context.getImageData(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHistory(prev => [...prev, currentState]);
    
    // Get last redo state
    const nextState = redoStack[redoStack.length - 1];
    context.putImageData(nextState, 0, 0);
    
    // Update redo stack
    setRedoStack(prev => prev.slice(0, -1));
    
    setLastAction({ 
      type: 'redo', 
      timestamp: new Date().getTime() 
    });
    
    // Broadcast redo action
    broadcastDrawingData({
      type: 'redo'
    });
  };

  // Save whiteboard as image
  const saveWhiteboard = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    
    const link = document.createElement('a');
    link.href = image;
    link.download = `ThinkBox_Whiteboard_${new Date().toISOString().slice(0,10)}.png`;
    link.click();
    
    setLastAction({ 
      type: 'save', 
      timestamp: new Date().getTime() 
    });
  };

  // Start panning the canvas
  const startPanning = (e) => {
    if ((e.button !== undefined && e.button !== 1) && tool !== 'pan') return; // Middle mouse button or pan tool
    
    setIsPanning(true);
    e.preventDefault();
  };

  // Pan the canvas
  const panCanvas = (e) => {
    if (!isPanning) return;
    
    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;
    
    setPanOffset(prev => ({
      x: prev.x + movementX / zoom,
      y: prev.y + movementY / zoom
    }));
  };

  // Stop panning
  const stopPanning = () => {
    setIsPanning(false);
  };

  // Mock function to broadcast drawing data to collaborators
  const broadcastDrawingData = (data) => {
    // In a real app, this would send data to your backend/websocket
    console.log("Broadcasting drawing data:", data);
  };

  // Handle pointer move for collaborative cursors
  const handlePointerMove = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    setCursorPosition({ 
      x: offsetX, 
      y: offsetY 
    });
    
    // In a real app, this would broadcast cursor position to other users
  };

  // Switch tool with animation
  const handleToolChange = (newTool) => {
    setActiveTool(newTool);
    setTimeout(() => {
      setTool(newTool);
      setActiveTool(null);
    }, 300);
  };

  return (
    <div className="whiteboard-container">
      {/* Animated notification for actions */}
      <AnimatePresence>
        {lastAction.timestamp && (new Date().getTime() - lastAction.timestamp < 2000) && (
          <motion.div 
            className={`action-notification ${lastAction.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {lastAction.type === 'undo' && 'Action undone'}
            {lastAction.type === 'redo' && 'Action redone'}
            {lastAction.type === 'clear' && 'Canvas cleared'}
            {lastAction.type === 'save' && 'Whiteboard saved'}
            {lastAction.type === 'draw' && 'Drawing saved'}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main toolbar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <WhiteboardToolbar 
          tool={tool}
          setTool={handleToolChange}
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          clearCanvas={clearCanvas}
          undo={handleUndo}
          redo={handleRedo}
          canUndo={history.length > 0}
          canRedo={redoStack.length > 0}
          saveWhiteboard={saveWhiteboard}
          zoom={zoom}
          setZoom={setZoom}
          resetView={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          activeTool={activeTool}
          canvasMode={canvasMode}
          setCanvasMode={setCanvasMode}
        />
      </motion.div>
      
      {/* Collaborators panel */}
      <AnimatePresence>
        {showCollaborators && (
          <motion.div 
            className="collaborators-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CollaboratorsList 
              collaborators={collaborators} 
              onClose={() => setShowCollaborators(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collaborators toggle button */}
      <motion.button 
        className="collaborators-toggle"
        onClick={() => setShowCollaborators(prev => !prev)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Users size={20} />
        <span className="collaborator-count">{collaborators.filter(c => c.active).length}</span>
      </motion.button>
      
      {/* Canvas container with zoom and pan */}
      <div 
        className="canvas-wrapper"
        style={{ cursor: isPanning ? 'grabbing' : (tool === 'pan' ? 'grab' : 'crosshair') }}
      >
        <div className="canvas-container">
          <div 
            ref={canvasContainerRef}
            className="canvas-interactive-area"
            onMouseDown={tool === 'pan' ? startPanning : startDrawing}
            onMouseMove={(e) => {
              if (isPanning) {
                panCanvas(e);
              } else {
                draw(e);
                handlePointerMove(e);
              }
            }}
            onMouseUp={() => {
              if (isPanning) {
                stopPanning();
              } else {
                finishDrawing();
              }
            }}
            onMouseLeave={() => {
              if (isPanning) {
                stopPanning();
              } else {
                finishDrawing();
              }
            }}
            onTouchStart={tool === 'pan' ? startPanning : startDrawing}
            onTouchMove={(e) => {
              if (isPanning) {
                // Touch pan handling would need additional logic
              } else {
                draw(e);
              }
            }}
            onTouchEnd={() => {
              if (isPanning) {
                stopPanning();
              } else {
                finishDrawing();
              }
            }}
          >
            <canvas
              ref={canvasRef}
            />
            
            {/* Collaborative cursors for other users */}
            {collaborators.filter(c => c.active).map(collaborator => (
              <motion.div 
                key={collaborator.id}
                className="remote-cursor"
                style={{ 
                  backgroundColor: collaborator.color,
                  left: `${Math.random() * 100}%`, // Simulated position - would be actual in real app
                  top: `${Math.random() * 100}%`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: Math.random() * 5, y: Math.random() * 5 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              >
                <div className="cursor-name">{collaborator.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Zoom controls */}
        <div className="zoom-controls">
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="zoom-btn"
          >-</button>
          <div className="zoom-level">{Math.round(zoom * 100)}%</div>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
            className="zoom-btn"
          >+</button>
          <button 
            onClick={() => {
              setZoom(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="zoom-reset"
          >Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;