// src/components/session/WorkspaceToolbar.jsx
import React, { useState } from 'react';

const WorkspaceToolbar = ({ viewMode, onViewModeChange, onUpdateSessionInfo, onShareSession }) => {
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: 'New Brainstorming Session',
    description: 'Start adding your ideas!',
    isPublic: true,
  });

  const handleSessionFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSessionForm({
      ...sessionForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitSessionEdit = (e) => {
    e.preventDefault();
    onUpdateSessionInfo(sessionForm);
    setIsEditingSession(false);
  };
  
  const handleShareClick = () => {
    if (onShareSession) {
      onShareSession();
    }
  };

  return (
    <div className="workspace-toolbar">
      <div className="toolbar-section">
        <div className="view-mode-selector">
          <span>View:</span>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            List
          </button>
          <button
            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => onViewModeChange('cards')}
          >
            Cards
          </button>
          <button
            className={`view-btn ${viewMode === 'mindmap' ? 'active' : ''}`}
            onClick={() => onViewModeChange('mindmap')}
          >
            Mind Map
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <button 
          className="btn-edit-session"
          onClick={() => setIsEditingSession(!isEditingSession)}
        >
          {isEditingSession ? 'Cancel' : 'Edit Session'}
        </button>
        
        {isEditingSession && (
          <div className="session-edit-modal">
            <form onSubmit={handleSubmitSessionEdit} className="session-form">
              <h3>Edit Session</h3>
              
              <div className="form-group">
                <label htmlFor="sessionTitle">Session Title</label>
                <input
                  type="text"
                  id="sessionTitle"
                  name="title"
                  value={sessionForm.title}
                  onChange={handleSessionFormChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sessionDescription">Description</label>
                <textarea
                  id="sessionDescription"
                  name="description"
                  value={sessionForm.description}
                  onChange={handleSessionFormChange}
                  className="form-control"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={sessionForm.isPublic}
                    onChange={handleSessionFormChange}
                  />
                  Public Session
                </label>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="toolbar-section">
        <button className="btn-share" onClick={handleShareClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor" />
          </svg>
          Share Session
        </button>
        <button className="btn-save">Save Session</button>
        <button className="btn-export">Export Ideas</button>
      </div>
    </div>
  );
};

export default WorkspaceToolbar;  