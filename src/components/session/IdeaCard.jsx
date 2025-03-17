import React, { useState } from 'react';

const IdeaCard = ({ idea, categoryName, categoryColor, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: idea.title,
    description: idea.description
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    
    if (!editData.title.trim()) {
      alert('Title cannot be empty');
      return;
    }
    
    onEdit(idea.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: idea.title,
      description: idea.description
    });
    setIsEditing(false);
  };

  // Function to handle voting
  const handleVote = (incrementBy) => {
    const newVotes = Math.max(0, idea.votes + incrementBy);
    onEdit(idea.id, { votes: newVotes });
  };

  return (
    <div className="idea-card" style={{ borderTop: `4px solid ${categoryColor}` }}>
      {isEditing ? (
        <form onSubmit={handleSubmitEdit} className="idea-edit-form">
          <div className="form-group">
            <label htmlFor={`title-${idea.id}`}>Title</label>
            <input
              type="text"
              id={`title-${idea.id}`}
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`description-${idea.id}`}>Description</label>
            <textarea
              id={`description-${idea.id}`}
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              className="form-control"
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-save">Save</button>
            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="card-header">
            <span className="category-tag" style={{ backgroundColor: categoryColor }}>
              {categoryName}
            </span>
            <div className="card-actions">
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => onDelete(idea.id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <h3 className="idea-title">{idea.title}</h3>
            {idea.description && <p className="idea-description">{idea.description}</p>}
          </div>
          
          <div className="card-footer">
            <div className="idea-meta">
              <span className="idea-author">By: {idea.author}</span>
              <span className="idea-date">
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="idea-voting">
              <button onClick={() => handleVote(-1)} disabled={idea.votes <= 0}>
                −
              </button>
              <span className="vote-count">{idea.votes}</span>
              <button onClick={() => handleVote(1)}>+</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IdeaCard;