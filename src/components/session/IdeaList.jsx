import React from 'react';
import IdeaCard from './IdeaCard';

const IdeaList = ({ ideas, categories, viewMode, onEditIdea, onDeleteIdea }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#999999';
  };

  // Group ideas by category for organization
  const ideasByCategory = ideas.reduce((acc, idea) => {
    const categoryId = idea.categoryId || 1;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(idea);
    return acc;
  }, {});

  // Render different views based on viewMode
  const renderIdeasView = () => {
    switch (viewMode) {
      case 'cards':
        return (
          <div className="ideas-card-view">
            {ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                categoryName={getCategoryName(idea.categoryId)}
                categoryColor={getCategoryColor(idea.categoryId)}
                onEdit={onEditIdea}
                onDelete={onDeleteIdea}
              />
            ))}
          </div>
        );
      case 'mindmap':
        // Placeholder for mindmap view (will be implemented later)
        return <div className="mindmap-placeholder">Mindmap view coming soon!</div>;
      case 'list':
      default:
        return (
          <div className="ideas-list-view">
            {Object.keys(ideasByCategory).map(categoryId => (
              <div key={categoryId} className="category-group">
                <h3 style={{ color: getCategoryColor(parseInt(categoryId)) }}>
                  {getCategoryName(parseInt(categoryId))}
                </h3>
                <ul className="ideas-list">
                  {ideasByCategory[categoryId].map(idea => (
                    <li key={idea.id} className="idea-list-item">
                      <div className="idea-header">
                        <h4>{idea.title}</h4>
                        <div className="idea-actions">
                          <button onClick={() => onEditIdea(idea.id, { ...idea })}>Edit</button>
                          <button onClick={() => onDeleteIdea(idea.id)}>Delete</button>
                        </div>
                      </div>
                      {idea.description && <p>{idea.description}</p>}
                      <div className="idea-meta">
                        <span>By: {idea.author}</span>
                        <span>Votes: {idea.votes}</span>
                        <span>
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="ideas-container">
      <h2>Ideas ({ideas.length})</h2>
      {ideas.length === 0 ? (
        <div className="no-ideas">
          <p>No ideas yet. Be the first to contribute!</p>
        </div>
      ) : (
        renderIdeasView()
      )}
    </div>
  );
};

export default IdeaList;