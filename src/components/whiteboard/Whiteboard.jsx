import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Whiteboard.css';
import WhiteboardToolbar from './WhiteboardToolbar';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  // Removed unused state variables
  const [history, setHistory] = useState([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make it visually fill the positioned parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Set the internal size to match
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    // Get context
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = size;
    contextRef.current = context;
    
    // Handle window resize
    const handleResize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = width;
      canvas.height = height;
      
      // Restore settings
      context.lineCap = 'round';
      context.strokeStyle = color;
      context.lineWidth = size;
      
      // Restore the image
      context.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [color, size]);

  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    
    if (tool === 'eraser') {
      contextRef.current.strokeStyle = '#ffffff';
      contextRef.current.lineWidth = size * 2;
    } else {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = size;
    }
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    
    // Save the current state before new drawing
    if (canvasRef.current) {
      const imageData = contextRef.current.getImageData(
        0, 0, 
        canvasRef.current.width, 
        canvasRef.current.height
      );
      setHistory([...history, imageData]);
    }
  };

  // Draw
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // Finish drawing
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const context = contextRef.current;
    
    // Save current state to history before clearing
    const imageData = context.getImageData(
      0, 0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    setHistory([...history, imageData]);
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Undo last action
  const undo = () => {
    if (history.length === 0 || !canvasRef.current || !contextRef.current) return;
    
    const context = contextRef.current;
    
    const lastState = history[history.length - 1];
    context.putImageData(lastState, 0, 0);
    
    setHistory(history.slice(0, -1));
  };

  return (
    <div className="whiteboard-container">
      <WhiteboardToolbar 
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        clearCanvas={clearCanvas}
        undo={undo}
        canUndo={history.length > 0}
      />
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard;