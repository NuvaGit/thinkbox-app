// src/components/session/ShareSessionModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/ShareModal.css';

const ShareSessionModal = ({ sessionCode, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const codeRef = useRef(null);
  
  // Focus on the code when modal opens
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.select();
    }
  }, []);
  
  const handleCopyCode = () => {
    codeRef.current.select();
    document.execCommand('copy');
    setCopySuccess(true);
    
    // Reset copy success after a short delay
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">
        <div className="modal-header">
          <h2>Share Session</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <p>Share this code with others so they can join your session:</p>
          
          <div className="session-code-container">
            <input
              ref={codeRef}
              type="text"
              value={sessionCode}
              readOnly
              className="session-code-input"
            />
            <button 
              className="copy-button"
              onClick={handleCopyCode}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="share-options">
            <h3>Or share via:</h3>
            <div className="share-buttons">
              <button className="share-button email">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
                </svg>
                Email
              </button>
              <button className="share-button slack">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M19.27 5.33C17.94 2.5 14.68 1.17 11.85 2.5 9.02 3.83 7.69 7.09 9.02 9.92L13 18.27C14.34 21.1 17.6 22.43 20.43 21.1 23.26 19.77 24.59 16.5 23.26 13.68L19.27 5.33M9.1 5.33C7.76 2.5 4.5 1.17 1.67 2.5-1.16 3.83-2.49 7.09-.83 9.92L3.16 18.27C4.5 21.1 7.76 22.43 10.59 21.1 13.42 19.77 14.76 16.5 13.43 13.68L9.1 5.33Z" fill="currentColor" />
                </svg>
                Slack
              </button>
              <button className="share-button teams">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 15C12.08 15 19 14.96 19 14.96C20.34 14.96 21.42 13.88 21.42 12.54S20.34 10.12 19 10.12C18.26 10.12 11.91 10.09 11.91 10.09V7.17L15.5 8.69C16.26 9.04 17.11 8.94 17.77 8.28C18.4 7.64 18.5 6.44 17.79 5.67C17.08 4.89 14.57 2.11 14.57 2.11C14.16 1.65 13.55 1.38 12.9 1.38C12.25 1.38 11.64 1.65 11.23 2.11L7.91 5.67C7.2 6.44 7.3 7.64 7.93 8.28C8.59 8.94 9.44 9.04 10.2 8.69L13.79 7.17V12.77L11.94 14.44C11.94 14.44 11.73 15 12 15M9.62 16.5C7.7 16.5 12.94 22 12.94 22C14.77 22 19.17 18.23 19.17 18.23L19.31 18.1C19.31 18.1 19.13 16.97 19 16.5C18.87 16.03 9.62 16.5 9.62 16.5Z" fill="currentColor" />
                </svg>
                Teams
              </button>
            </div>
          </div>
          
          <div className="qr-code-section">
            <div className="qr-code">
              {/* This would be an actual QR code in a production app */}
              <div className="placeholder-qr">QR Code</div>
            </div>
            <p>Scan to join on mobile</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ShareSessionModal;