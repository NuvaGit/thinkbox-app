// MiniMap.jsx - A component to show a miniature view of the entire canvas
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MiniMap = ({ canvasRef, zoom, panOffset, setViewport }) => {
  const miniMapRef = useRef(null);
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // Update minimap whenever the main canvas changes
  useEffect(() => {
    const updateMiniMap = () => {
      const canvas = canvasRef.current;
      const miniMap = miniMapRef.current;
      
      if (!canvas || !miniMap) return;
      
      const ctx = miniMap.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      // Clear the minimap
      ctx.clearRect(0, 0, miniMap.width, miniMap.height);
      
      // Scale down the main canvas to fit in the minimap
      const scaleFactor = miniMap.width / (canvas.width / dpr);
      
      // Draw the content from the main canvas
      ctx.drawImage(
        canvas, 
        0, 0, canvas.width / dpr, canvas.height / dpr,
        0, 0, miniMap.width, miniMap.height
      );
      
      // Update the viewport rectangle
      if (viewportRef.current) {
        const viewportWidth = (miniMap.width / zoom);
        const viewportHeight = (miniMap.height / zoom);
        
        // Calculate viewport position based on pan offset
        const viewportX = (-panOffset.x / (canvas.width / dpr)) * miniMap.width;
        const viewportY = (-panOffset.y / (canvas.height / dpr)) * miniMap.height;
        
        // Update viewport element position and size
        viewportRef.current.style.width = `${viewportWidth}px`;
        viewportRef.current.style.height = `${viewportHeight}px`;
        viewportRef.current.style.transform = `translate(${viewportX}px, ${viewportY}px)`;
      }
    };
    
    // Initial update
    updateMiniMap();
    
    // Setup MutationObserver to watch for changes to the canvas
    const observer = new MutationObserver(updateMiniMap);
    if (canvasRef.current) {
      observer.observe(canvasRef.current, { attributes: true, childList: true, subtree: true });
    }
    
    // Cleanup
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [canvasRef, zoom, panOffset]);
  
  // Handle minimap click to move viewport
  const handleMiniMapClick = (e) => {
    const miniMap = miniMapRef.current;
    const rect = miniMap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / miniMap.width;
    const y = (e.clientY - rect.top) / miniMap.height;
    
    // Update main canvas position based on clicked position in minimap
    setViewport({ x, y });
  };
  
  // Handle viewport drag in minimap
  const handleViewportDragStart = (e) => {
    e.stopPropagation();
    isDraggingRef.current = true;
  };
  
  const handleViewportDrag = (e) => {
    if (!isDraggingRef.current) return;
    
    const miniMap = miniMapRef.current;
    const rect = miniMap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / miniMap.width;
    const y = (e.clientY - rect.top) / miniMap.height;
    
    setViewport({ x, y });
  };
  
  const handleViewportDragEnd = () => {
    isDraggingRef.current = false;
  };
  
  useEffect(() => {
    document.addEventListener('mousemove', handleViewportDrag);
    document.addEventListener('mouseup', handleViewportDragEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleViewportDrag);
      document.removeEventListener('mouseup', handleViewportDragEnd);
    };
  }, []);
  
  return (
    <motion.div 
      className="minimap-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="minimap-header">Overview</div>
      <div className="minimap-content" onClick={handleMiniMapClick}>
        <canvas ref={miniMapRef} width={150} height={100} />
        <div 
          ref={viewportRef} 
          className="minimap-viewport" 
          onMouseDown={handleViewportDragStart}
        />
      </div>
    </motion.div>
  );
};

export default MiniMap;
