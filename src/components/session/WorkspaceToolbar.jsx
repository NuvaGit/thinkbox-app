import React, { useState } from 'react';

const WorkspaceToolbar = ({ viewMode, onViewModeChange, onUpdateSessionInfo }) => {
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
        <button className="btn-share">Share Session</button>
        <button className="btn-save">Save Session</button>
        <button className="btn-export">Export Ideas</button>
      </div>
    </div>
  );
};

export default WorkspaceToolbar;