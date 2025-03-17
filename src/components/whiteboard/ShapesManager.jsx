// ShapesManager.jsx - For handling shape drawing on canvas
import React, { useEffect, useState } from 'react';

const ShapesManager = ({ canvasRef, contextRef, currentShape, color, size, onShapeComplete }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [tempCanvas, setTempCanvas] = useState(null);
  
  useEffect(() => {
    // Create a temporary canvas for shape preview
    if (canvasRef.current && !tempCanvas) {
      const canvas = canvasRef.current;
      const tempCanvasElem = document.createElement('canvas');
      tempCanvasElem.width = canvas.width;
      tempCanvasElem.height = canvas.height;
      tempCanvasElem.style.position = 'absolute';
      tempCanvasElem.style.top = '0';
      tempCanvasElem.style.left = '0';
      tempCanvasElem.style.pointerEvents = 'none';
      tempCanvasElem.className = 'shape-preview-canvas';
      
      canvas.parentNode.appendChild(tempCanvasElem);
      setTempCanvas(tempCanvasElem);
    }
    
    return () => {
      if (tempCanvas) {
        tempCanvas.remove();
      }
    };
  }, [canvasRef, tempCanvas]);
  
  // Start drawing shape
  const startDrawingShape = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPoint({ x: offsetX, y: offsetY });
    setEndPoint({ x: offsetX, y: offsetY });
  };
  
  // Update shape preview as mouse moves
  const updateShapePreview = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    setEndPoint({ x: offsetX, y: offsetY });
    
    if (tempCanvas) {
      const ctx = tempCanvas.getContext('2d');
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw shape preview
      drawShape(ctx, currentShape);
    }
  };
  
  // Finish drawing shape
  const finishDrawingShape = () => {
    if (!isDrawing) return;
    
    // Draw the final shape on the main canvas
    if (contextRef.current && canvasRef.current) {
      drawShape(contextRef.current, currentShape);
      
      // Clear the temp canvas
      if (tempCanvas) {
        const ctx = tempCanvas.getContext('2d');
        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      }
      
      // Save shape data for undo/redo
      onShapeComplete({
        type: 'shape',
        shape: currentShape,
        start: startPoint,
        end: endPoint,
        strokeColor: color,
        strokeWidth: size,
        fillColor: currentShape.fillColor || 'transparent'
      });
    }
    
    setIsDrawing(false);
  };
  
  // Draw shape based on type
  const drawShape = (context, shape) => {
    if (!context) return;
    
    const x1 = startPoint.x;
    const y1 = startPoint.y;
    const x2 = endPoint.x;
    const y2 = endPoint.y;
    
    // Save context state
    context.save();
    
    // Set up styling
    context.strokeStyle = color;
    context.lineWidth = size;
    context.fillStyle = shape.fillColor || 'transparent';
    
    // Draw shape based on type
    context.beginPath();
    
    switch (shape.type) {
      case 'rectangle':
        context.rect(
          Math.min(x1, x2),
          Math.min(y1, y2),
          Math.abs(x2 - x1),
          Math.abs(y2 - y1)
        );
        break;
        
      case 'circle':
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        context.arc(x1, y1, radius, 0, 2 * Math.PI);
        break;
        
      case 'triangle':
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x1 - (x2 - x1), y2);
        context.closePath();
        break;
        
      case 'line':
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        break;
        
      case 'hexagon':
        const hexRadius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const hx = x1 + hexRadius * Math.cos(angle);
          const hy = y1 + hexRadius * Math.sin(angle);
          if (i === 0) {
            context.moveTo(hx, hy);
          } else {
            context.lineTo(hx, hy);
          }
        }
        context.closePath();
        break;
        
      case 'star':
        const outerRadius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const innerRadius = outerRadius / 2;
        const points = 5;
        
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points;
          const sx = x1 + radius * Math.cos(angle);
          const sy = y1 + radius * Math.sin(angle);
          
          if (i === 0) {
            context.moveTo(sx, sy);
          } else {
            context.lineTo(sx, sy);
          }
        }
        context.closePath();
        break;
        
      default:
        break;
    }
    
    // Fill and stroke the shape
    if (shape.fillColor && shape.fillColor !== 'transparent') {
      context.fill();
    }
    context.stroke();
    
    // Restore context state
    context.restore();
  };
  
  return (
    <div 
      className="shapes-manager"
      onMouseDown={startDrawingShape}
      onMouseMove={updateShapePreview}
      onMouseUp={finishDrawingShape}
      onMouseLeave={finishDrawingShape}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        cursor: 'crosshair',
        zIndex: 10
      }}
    />
  );
};

export default ShapesManager;