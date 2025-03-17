// CollaboratorsList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const CollaboratorsList = ({ collaborators, onClose }) => {
  return (
    <div className="collaborators-list">
      <div className="collaborators-header">
        <h3>Collaborators</h3>
        <motion.button 
          className="close-btn"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>
      
      <div className="collaborators-content">
        {collaborators.map((collaborator) => (
          <motion.div 
            key={collaborator.id}
            className={`collaborator-item ${collaborator.active ? 'active' : 'inactive'}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="collaborator-avatar" style={{ borderColor: collaborator.color }}>
              <img src={collaborator.avatar} alt={collaborator.name} />
              <div className={`status-indicator ${collaborator.active ? 'active' : ''}`}></div>
            </div>
            
            <div className="collaborator-info">
              <div className="collaborator-name">{collaborator.name}</div>
              <div className="collaborator-status">
                {collaborator.active ? 'Active now' : 'Inactive'}
              </div>
            </div>
            
            <motion.button 
              className="collaborator-action"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle size={16} />
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      <div className="invite-section">
        <motion.button 
          className="invite-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Invite New Collaborator
        </motion.button>
      </div>
    </div>
  );
};
export default CollaboratorsList;