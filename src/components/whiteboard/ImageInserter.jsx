// ImageInserter.jsx - For adding images to the whiteboard
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link, Camera } from 'lucide-react';

const ImageInserter = ({ onInsert, onClose, contextRef, canvasRef }) => {
  const [uploadType, setUploadType] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };
  
  const handleImageUpload = (files) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        insertImageToCanvas(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const handleUrlSubmit = () => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      insertImageToCanvas(img);
    };
    img.onerror = () => {
      alert('Error loading image. Please check the URL and try again.');
    };
    img.src = imageUrl;
  };
  
  const handleWebcamCapture = () => {
    // This would typically use a webcam library like react-webcam
    // For this example, we'll just show how it would be integrated
    alert('Webcam functionality would be implemented with a library like react-webcam');
  };
  
  const insertImageToCanvas = (img) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate dimensions to maintain aspect ratio
    const maxWidth = (canvas.width / dpr) * 0.5;
    const maxHeight = (canvas.height / dpr) * 0.5;
    
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = height * ratio;
    }
    
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = width * ratio;
    }
    
    // Center the image on canvas
    const x = ((canvas.width / dpr) - width) / 2;
    const y = ((canvas.height / dpr) - height) / 2;
    
    // Draw the image
    context.drawImage(img, x, y, width, height);
    
    // Save image data for undo/redo functionality
    onInsert({
      type: 'image',
      x,
      y,
      width,
      height,
      src: img.src
    });
    
    onClose();
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <motion.div 
      className="image-inserter"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="image-inserter-header">
        <h3>Add Image</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="upload-type-selector">
        <button 
          className={`upload-type-btn ${uploadType === 'upload' ? 'active' : ''}`}
          onClick={() => setUploadType('upload')}
        >
          <Upload size={16} />
          <span>Upload</span>
        </button>
        <button 
          className={`upload-type-btn ${uploadType === 'url' ? 'active' : ''}`}
          onClick={() => setUploadType('url')}
        >
          <Link size={16} />
          <span>URL</span>
        </button>
        <button 
          className={`upload-type-btn ${uploadType === 'webcam' ? 'active' : ''}`}
          onClick={() => setUploadType('webcam')}
        >
          <Camera size={16} />
          <span>Camera</span>
        </button>
      </div>
      
      <div className="upload-content">
        {uploadType === 'upload' && (
          <div 
            className={`file-drop-area ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={24} />
            <p>Drag & drop image here or <button className="browse-btn" onClick={triggerFileInput}>browse</button></p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e.target.files)}
              accept="image/*"
              className="file-input"
            />
          </div>
        )}
        
        {uploadType === 'url' && (
          <div className="url-input-container">
            <input 
              type="text" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="url-input"
            />
            <button 
              className="url-submit-btn"
              onClick={handleUrlSubmit}
              disabled={!imageUrl}
            >
              Add Image
            </button>
          </div>
        )}
        
        {uploadType === 'webcam' && (
          <div className="webcam-container">
            <div className="webcam-placeholder">
              <Camera size={48} />
              <p>Webcam capture would be implemented here</p>
            </div>
            <button 
              className="capture-btn"
              onClick={handleWebcamCapture}
            >
              Capture Image
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageInserter;