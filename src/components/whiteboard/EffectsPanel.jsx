// EffectsPanel.jsx - For adding visual effects to whiteboard
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplet, Wind, Zap, X } from 'lucide-react';

const EffectsPanel = ({ onApplyEffect, onClose }) => {
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [intensity, setIntensity] = useState(50);
  
  const effects = [
    { id: 'blur', icon: <Droplet size={24} />, label: 'Blur' },
    { id: 'sharpen', icon: <Zap size={24} />, label: 'Sharpen' },
    { id: 'noise', icon: <Sparkles size={24} />, label: 'Noise' },
    { id: 'motion-blur', icon: <Wind size={24} />, label: 'Motion Blur' }
  ];
  
  const handleSelectEffect = (effect) => {
    setSelectedEffect(effect);
  };
  
  const handleApply = () => {
    if (selectedEffect) {
      onApplyEffect({
        type: selectedEffect,
        intensity: intensity
      });
    }
    onClose();
  };
  
  return (
    <motion.div 
      className="effects-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="effects-header">
        <h3>Apply Effects</h3>
        <motion.button 
          className="close-btn"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>
      
      <div className="effects-grid">
        {effects.map((effect) => (
          <motion.button
            key={effect.id}
            className={`effect-btn ${selectedEffect === effect.id ? 'active' : ''}`}
            onClick={() => handleSelectEffect(effect.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="effect-icon">{effect.icon}</div>
            <span className="effect-label">{effect.label}</span>
          </motion.button>
        ))}
      </div>
      
      {selectedEffect && (
        <div className="effect-settings">
          <div className="intensity-control">
            <label>Intensity: {intensity}%</label>
            <input
              type="range"
              min="1"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="intensity-slider"
            />
          </div>
        </div>
      )}
      
      <div className="effects-footer">
        <button 
          className="cancel-btn" 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className="apply-btn" 
          onClick={handleApply}
          disabled={!selectedEffect}
        >
          Apply Effect
        </button>
      </div>
    </motion.div>
  );
};

export default EffectsPanel;
