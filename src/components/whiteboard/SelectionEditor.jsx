// SelectionEditor.jsx - For editing lasso selections
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCw, Maximize2, Copy, Trash2, X } from 'lucide-react';

const SelectionEditor = ({ 
  selection, 
  canvasRef, 
  contextRef, 
  onApplyChanges,
  onCancel, 
  onDelete, 
  onDuplicate 
}) => {
  const [position, setPosition] = useState({ 
    x: selection.bounds.minX, 
    y: selection.bounds.minY 
  });
  const [size, setSize] = useState({ 
    width: selection.bounds.width, 
    height: selection.bounds.height 
  });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [originalImageData, setOriginalImageData] = useState(selection.imageData);
  const selectionRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  // Create a canvas for the selected region
  useEffect(() => {
    if (selectionRef.current && originalImageData) {
      const canvas = selectionRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = originalImageData.width;
      canvas.height = originalImageData.height;
      
      ctx.putImageData(originalImageData, 0, 0);
    }
  }, [originalImageData]);
  
  // Start dragging the selection
  const startDrag = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  // Update position as mouse moves
  const updateDrag = (e) => {
    if (!isDragging) return;
    
    const containerRect = canvasRef.current.getBoundingClientRect();
    
    setPosition({
      x: e.clientX - containerRect.left - dragOffset.current.x,
      y: e.clientY - containerRect.top - dragOffset.current.y
    });
  };
  
  // Finish dragging
  const finishDrag = () => {
    setIsDragging(false);
  };
  
  // Start resizing the selection
  const startResize = (e, handle) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      position: { ...position }
    };
  };
  
  // Update size as mouse moves
  const updateResize = (e) => {
    if (!isResizing) return;
    
    const dx = e.clientX - dragOffset.current.x;
    const dy = e.clientY - dragOffset.current.y;
    
    let newWidth = dragOffset.current.width;
    let newHeight = dragOffset.current.height;
    let newX = dragOffset.current.position.x;
    let newY = dragOffset.current.position.y;
    
    switch (resizeHandle) {
      case 'top-left':
        newWidth = dragOffset.current.width - dx;
        newHeight = dragOffset.current.height - dy;
        newX = dragOffset.current.position.x + dx;
        newY = dragOffset.current.position.y + dy;
        break;
      case 'top-right':
        newWidth = dragOffset.current.width + dx;
        newHeight = dragOffset.current.height - dy;
        newY = dragOffset.current.position.y + dy;
        break;
      case 'bottom-left':
        newWidth = dragOffset.current.width - dx;
        newHeight = dragOffset.current.height + dy;
        newX = dragOffset.current.position.x + dx;
        break;
      case 'bottom-right':
        newWidth = dragOffset.current.width + dx;
        newHeight = dragOffset.current.height + dy;
        break;
      default:
        break;
    }
    
    // Enforce minimum size
    if (newWidth >= 10 && newHeight >= 10) {
      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };
  
  // Finish resizing
  const finishResize = () => {
    setIsResizing(false);
    setResizeHandle(null);
  };
  
  // Start rotation
  const startRotate = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    
    const rect = selectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    dragOffset.current = {
      centerX,
      centerY,
      startAngle: Math.atan2(e.clientY - centerY, e.clientX - centerX) - rotation * Math.PI / 180
    };
  };
  
  // Update rotation as mouse moves
  const updateRotate = (e) => {
    if (!isRotating) return;
    
    const { centerX, centerY, startAngle } = dragOffset.current;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    let newRotation = ((angle - startAngle) * 180 / Math.PI) % 360;
    setRotation(newRotation);
  };
  
  // Finish rotation
  const finishRotate = () => {
    setIsRotating(false);
  };
  
  // Apply changes to the main canvas
  const applyChanges = () => {
    if (!contextRef.current || !canvasRef.current || !selectionRef.current) return;
    
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Save context state
    context.save();
    
    // Clear the original area
    // (In a real implementation, you'd use the stored background underneath the selection)
    context.fillStyle = '#ffffff';
    context.fillRect(
      selection.bounds.minX * dpr,
      selection.bounds.minY * dpr,
      selection.bounds.width * dpr,
      selection.bounds.height * dpr
    );
    
    // Translate and rotate around the center of the new position
    const centerX = (position.x + size.width / 2) * dpr;
    const centerY = (position.y + size.height / 2) * dpr;
    
    context.translate(centerX, centerY);
    context.rotate(rotation * Math.PI / 180);
    
    // Draw the selection
    context.drawImage(
      selectionRef.current,
      -size.width * dpr / 2,
      -size.height * dpr / 2,
      size.width * dpr,
      size.height * dpr
    );
    
    // Restore context state
    context.restore();
    
    // Call the parent handler
    onApplyChanges();
  };
  
  // Handle mouse events globally to ensure smooth dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        updateDrag(e);
      } else if (isResizing) {
        updateResize(e);
      } else if (isRotating) {
        updateRotate(e);
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        finishDrag();
      } else if (isResizing) {
        finishResize();
      } else if (isRotating) {
        finishRotate();
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isRotating]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        onDelete();
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onDuplicate();
      } else if (e.key === 'Enter') {
        applyChanges();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onDelete, onDuplicate]);
  
  return (
    <div className="selection-editor">
      <motion.div 
        className="selection-container"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 100
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onMouseDown={startDrag}
      >
        <canvas 
          ref={selectionRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none'
          }}
        />
        
        {/* Selection border */}
        <div className="selection-border"></div>
        
        {/* Resize handles */}
        <div 
          className="resize-handle top-left" 
          onMouseDown={(e) => startResize(e, 'top-left')}
        />
        <div 
          className="resize-handle top-right" 
          onMouseDown={(e) => startResize(e, 'top-right')}
        />
        <div 
          className="resize-handle bottom-left" 
          onMouseDown={(e) => startResize(e, 'bottom-left')}
        />
        <div 
          className="resize-handle bottom-right" 
          onMouseDown={(e) => startResize(e, 'bottom-right')}
        />
        
        {/* Rotation handle */}
        <div 
          className="rotate-handle"
          onMouseDown={startRotate}
        >
          <RotateCw size={16} />
        </div>
      </motion.div>
      
      {/* Selection toolbar */}
      <motion.div 
        className="selection-toolbar"
        style={{
          position: 'absolute',
          left: `${position.x + size.width / 2}px`,
          top: `${position.y - 50}px`,
          transform: 'translateX(-50%)',
          zIndex: 101
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button className="selection-tool-btn" title="Move" disabled>
          <Move size={16} />
        </button>
        <button className="selection-tool-btn" title="Duplicate" onClick={onDuplicate}>
          <Copy size={16} />
        </button>
        <button className="selection-tool-btn" title="Delete" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
        <div className="toolbar-separator"></div>
        <button className="selection-tool-btn apply-btn" title="Apply Changes" onClick={applyChanges}>
          Apply
        </button>
        <button className="selection-tool-btn cancel-btn" title="Cancel" onClick={onCancel}>
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
};

export default SelectionEditor;