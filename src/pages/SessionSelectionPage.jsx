import React, { useState, useEffect } from 'react';
import '../styles/SessionSelection.css';

const SessionSelection = ({ onCreateSession, onJoinSession }) => {
  const [sloganVisible, setSloganVisible] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(null);
  
  // Animate slogan on component mount
  useEffect(() => {
    setTimeout(() => {
      setSloganVisible(true);
    }, 300);
  }, []);

  const handleJoinClick = () => {
    setShowJoinInput(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      onJoinSession(joinCode);
    } else {
      alert('Please enter a session code');
    }
  };

  const handleCreateClick = () => {
    onCreateSession();
  };

  return (
    <div className="session-selection-page">
      <div className="mountain-background">
        <div className="mountain-image"></div>
      </div>
      
      {/* Animated App Slogan */}
      <div className={`app-slogan ${sloganVisible ? 'visible' : ''}`}>
        <p className="slogan-text">Turn your thoughts into action.</p>
      </div>
      
      <div className="session-selection-container">
        <div className="circle-arrow">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M7 10l5 5 5-5z" fill="#222" />
          </svg>
        </div>
        
        <div className="selection-container">
          <h1 className="selection-title">BEGIN YOUR SESSION</h1>
          
          {!showJoinInput ? (
            <div className="buttons-container">
              <button 
                className={`selection-button create-button ${buttonHovered === 'create' ? 'hovered' : ''}`}
                onClick={handleCreateClick}
                onMouseEnter={() => setButtonHovered('create')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                <div className="button-content">
                  <div className="icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                    </svg>
                  </div>
                  <span>Create Session</span>
                </div>
                <div className="button-glow"></div>
              </button>
              
              <button 
                className={`selection-button join-button ${buttonHovered === 'join' ? 'hovered' : ''}`}
                onClick={handleJoinClick}
                onMouseEnter={() => setButtonHovered('join')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                <div className="button-content">
                  <div className="icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor" />
                    </svg>
                  </div>
                  <span>Join Session</span>
                </div>
                <div className="button-glow"></div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="join-form">
              <div className="input-group">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#aaa" />
                </svg>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter Session Code"
                  className="form-input"
                  maxLength="6"
                />
              </div>
              
              <div className="join-buttons">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => setShowJoinInput(false)}
                >
                  Back
                </button>
                <button type="submit" className="join-submit-button">
                  Join
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionSelection;