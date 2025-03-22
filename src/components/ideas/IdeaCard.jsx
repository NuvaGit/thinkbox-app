// src/components/ideas/IdeaCard.jsx
import React, { useState } from 'react';

const IdeaCard = ({ 
  idea, 
  categories, 
  isExpanded, 
  onExpand, 
  onPin, 
  onArchive, 
  onVoting, 
  onVote, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: idea.title,
    description: idea.description || '',
    categoryId: idea.categoryId
  });
  
  // Get category info
  const getCategory = () => {
    return categories.find(cat => cat.id === idea.categoryId) || 
      { name: 'Uncategorized', color: '#999999' };
  };
  
  const category = getCategory();
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };
  
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editData.title.trim()) return;
    
    onEdit(idea.id, editData);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditData({
      title: idea.title,
      description: idea.description || '',
      categoryId: idea.categoryId
    });
    setIsEditing(false);
  };
  
  // Determine card styling based on status
  const getCardClasses = () => {
    let classes = 'idea-card';
    if (isExpanded) classes += ' expanded';
    if (idea.isPinned) classes += ' pinned';
    if (idea.isArchived) classes += ' archived';
    if (idea.isInVoting) classes += ' in-voting';
    return classes;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  return (
    <div 
      className={getCardClasses()}
      style={{ borderTopColor: category.color }}
    >
      {isEditing ? (
        <div className="card-edit-form">
          <form onSubmit={handleSubmitEdit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                className="form-control"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="categoryId"
                value={editData.categoryId}
                onChange={handleEditChange}
                className="form-control"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="edit-actions">
              <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="card-header">
            <div className="category-tag" style={{ backgroundColor: category.color }}>
              {category.name}
            </div>
            
            {idea.isPinned && (
              <div className="status-indicator pinned-indicator">
                <span className="status-icon">📌</span>
                <span className="status-text">Pinned</span>
              </div>
            )}
            
            {idea.isArchived && (
              <div className="status-indicator archived-indicator">
                <span className="status-icon">🗄️</span>
                <span className="status-text">Archived</span>
              </div>
            )}
            
            {idea.isInVoting && (
              <div className="status-indicator voting-indicator">
                <span className="status-icon">🗳️</span>
                <span className="status-text">In Voting</span>
              </div>
            )}
          </div>
          
          <div className="card-content" onClick={onExpand}>
            <h3 className="idea-title">{idea.title}</h3>
            
            {idea.description && (
              <div className={`idea-description ${isExpanded ? 'expanded' : ''}`}>
                <p>{idea.description}</p>
              </div>
            )}
            
            <div className="idea-meta">
              <span className="idea-author">
                {idea.isAnonymous ? 'Anonymous' : idea.author || 'Anonymous User'}
              </span>
              <span className="idea-date">{formatDate(idea.createdAt)}</span>
            </div>
          </div>
          
          <div className="card-actions">
            <div className="voting-actions">
              <button 
                className="btn-vote down"
                onClick={() => onVote(idea.id, -1)}
                disabled={idea.votes <= 0}
              >
                −
              </button>
              <span className="vote-count">{idea.votes}</span>
              <button 
                className="btn-vote up"
                onClick={() => onVote(idea.id, 1)}
              >
                +
              </button>
            </div>
            
            <div className="management-actions">
              <button 
                className={`btn-action ${idea.isPinned ? 'active' : ''}`}
                onClick={onPin}
                title={idea.isPinned ? "Unpin" : "Pin"}
              >
                📌
              </button>
              <button 
                className={`btn-action ${idea.isInVoting ? 'active' : ''}`}
                onClick={onVoting}
                title={idea.isInVoting ? "Remove from voting" : "Add to voting"}
              >
                🗳️
              </button>
              <button 
                className={`btn-action ${idea.isArchived ? 'active' : ''}`}
                onClick={onArchive}
                title={idea.isArchived ? "Unarchive" : "Archive"}
              >
                🗄️
              </button>
            </div>
          </div>
          
          {isExpanded && (
            <div className="expanded-actions">
              <button 
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this idea?')) {
                    onDelete(idea.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IdeaCard;