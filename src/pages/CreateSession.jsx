import React, { useState, useEffect } from 'react';
import '../styles/CreateSession.css';
// Import your mountain image
import mountainBackground from '../assets/images/purplemountain.jpg';

const CreateSession = ({ onCreateSession }) => {
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    isPublic: true,
    sessionCode: generateSessionCode(), // Random session code
  });
  
  const [sloganVisible, setSloganVisible] = useState(false);

  // Generate a random session code
  function generateSessionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Animate slogan on component mount
  useEffect(() => {
    setTimeout(() => {
      setSloganVisible(true);
    }, 300);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSessionData({
      ...sessionData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!sessionData.title.trim()) {
      alert('Please enter a session title');
      return;
    }
    
    // Create the session
    if (onCreateSession) {
      onCreateSession(sessionData);
    }
  };

  return (
    <div className="create-session-page">
      <div className="mountain-background">
        <div className="mountain-image"></div>
      </div>
      
      {/* Animated App Slogan Above Box */}
      <div className={`app-slogan ${sloganVisible ? 'visible' : ''}`}>
        <p className="slogan-text">Turn your thoughts into action.</p>
      </div>
      
      <div className="create-session-container">
        <div className="circle-arrow">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M7 10l5 5 5-5z" fill="#222" />
          </svg>
        </div>
        
        <div className="session-form-container">
          <h1 className="session-title">CREATE SESSION</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" fill="#aaa" />
              </svg>
              <input
                type="text"
                id="title"
                name="title"
                value={sessionData.title}
                onChange={handleChange}
                placeholder="Session Title"
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <svg className="input-icon description-icon" viewBox="0 0 24 24">
                <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" fill="#aaa" />
              </svg>
              <textarea
                id="description"
                name="description"
                value={sessionData.description}
                onChange={handleChange}
                placeholder="Description (Optional)"
                className="form-input description-input"
              />
            </div>

            <div className="code-container">
              <h2 className="code-title">Session Code</h2>
              <div className="code-display">
                {sessionData.sessionCode}
              </div>
              <p className="code-info">
                Share this code with others to join your session
              </p>
            </div>
            
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={sessionData.isPublic}
                onChange={handleChange}
                className="session-checkbox"
              />
              <label htmlFor="isPublic" className="checkbox-label">
                Make this session public (anyone with the code can join)
              </label>
            </div>
            
            <button type="submit" className="create-button">
              Create Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;