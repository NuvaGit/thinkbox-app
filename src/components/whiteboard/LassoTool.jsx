// LassoTool.jsx - For selecting and manipulating regions
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCw, Maximize2, Copy, Trash2, X } from 'lucide-react';

const LassoTool = ({ canvasRef, contextRef, onSelectionComplete, onCancel }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionPoints, setSelectionPoints] = useState([]);
  const [tempCanvas, setTempCanvas] = useState(null);
  
  useEffect(() => {
    // Create a temporary canvas for selection preview
    if (canvasRef.current && !tempCanvas) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const tempCanvasElem = document.createElement('canvas');
      tempCanvasElem.width = canvas.width;
      tempCanvasElem.height = canvas.height;
      tempCanvasElem.style.position = 'absolute';
      tempCanvasElem.style.top = '0';
      tempCanvasElem.style.left = '0';
      tempCanvasElem.style.pointerEvents = 'none';
      tempCanvasElem.className = 'lasso-selection-canvas';
      
      canvas.parentNode.appendChild(tempCanvasElem);
      setTempCanvas(tempCanvasElem);
    }
    
    return () => {
      if (tempCanvas) {
        tempCanvas.remove();
      }
    };
  }, [canvasRef, tempCanvas]);
  
  // Start selection
  const startSelection = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsSelecting(true);
    setSelectionPoints([{ x: offsetX, y: offsetY }]);
  };
  
  // Update selection as mouse moves
  const updateSelection = (e) => {
    if (!isSelecting) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    setSelectionPoints([...selectionPoints, { x: offsetX, y: offsetY }]);
    
    if (tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw selection path
      drawSelectionPath(ctx);
    }
  };
  
  // Finish selection
  const finishSelection = () => {
    if (!isSelecting || selectionPoints.length < 3) {
      setIsSelecting(false);
      setSelectionPoints([]);
      return;
    }
    
    // Close the path
    const firstPoint = selectionPoints[0];
    setSelectionPoints([...selectionPoints, firstPoint]);
    
    // Create a clipping region
    if (contextRef.current && canvasRef.current && tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw final selection
      drawSelectionPath(ctx, true);
      
      // Get selected region data
      const bounds = calculateSelectionBounds();
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const dpr = window.devicePixelRatio || 1;
      
      const imageData = context.getImageData(
        bounds.minX * dpr,
        bounds.minY * dpr,
        bounds.width * dpr,
        bounds.height * dpr
      );
      
      // Send selection data to parent component
      onSelectionComplete({
        type: 'lasso',
        points: selectionPoints,
        bounds,
        imageData
      });
    }
    
    setIsSelecting(false);
    setSelectionPoints([]);
  };
  
  // Draw the selection path
  const drawSelectionPath = (ctx, isFinal = false) => {
    if (!ctx || selectionPoints.length < 2) return;
    
    ctx.save();
    
    ctx.strokeStyle = '#4a6bff';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(selectionPoints[0].x, selectionPoints[0].y);
    
    for (let i = 1; i < selectionPoints.length; i++) {
      ctx.lineTo(selectionPoints[i].x, selectionPoints[i].y);
    }
    
    if (isFinal) {
      ctx.closePath();
      ctx.fillStyle = 'rgba(74, 107, 255, 0.1)';
      ctx.fill();
    }
    
    ctx.stroke();
    ctx.restore();
  };
  
  // Calculate bounds of selection
  const calculateSelectionBounds = () => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    selectionPoints.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    return {
      minX: Math.floor(minX),
      minY: Math.floor(minY),
      maxX: Math.ceil(maxX),
      maxY: Math.ceil(maxY),
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY)
    };
  };
  
  // Handle escape key to cancel selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSelecting(false);
        setSelectionPoints([]);
        
        // Clear temp canvas
        if (tempCanvas) {
          const ctx = tempCanvas.getContext('2d');
          ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        
        if (onCancel) {
          onCancel();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tempCanvas, onCancel]);
  
  return (
    <div 
      className="lasso-tool"
      onMouseDown={startSelection}
      onMouseMove={updateSelection}
      onMouseUp={finishSelection}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        cursor: 'crosshair',
        zIndex: 10
      }}
    >
      {isSelecting && (
        <div className="selection-instructions">
          Draw around the area you want to select
        </div>
      )}
    </div>
  );
};

export default LassoTool;