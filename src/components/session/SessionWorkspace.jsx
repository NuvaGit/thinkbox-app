import React, { useState } from 'react';
import IdeaForm from './IdeaForm';
import IdeaList from './IdeaList';
import CategoryList from './CategoryList';
import WorkspaceToolbar from './WorkspaceToolbar';

const SessionWorkspace = () => {
  // State for managing ideas
  const [ideas, setIdeas] = useState([]);
  // State for managing categories
  const [categories, setCategories] = useState([
    { id: 1, name: 'Uncategorized', color: '#999999' }
  ]);
  // State for view mode (list, cards, mindmap)
  const [viewMode, setViewMode] = useState('list');
  // State for session info
  const [sessionInfo, setSessionInfo] = useState({
    title: 'New Brainstorming Session',
    description: 'Start adding your ideas!',
    isPublic: true,
  });

  // Handler for adding a new idea
  const handleAddIdea = (newIdea) => {
    // Generate a unique id
    const id = Date.now();
    // Set default category to 'Uncategorized'
    const categoryId = newIdea.categoryId || 1;
    
    setIdeas([
      ...ideas,
      { 
        id, 
        ...newIdea, 
        categoryId,
        createdAt: new Date(),
        votes: 0,
        author: 'Anonymous User' // Will be replaced with actual user once auth is implemented
      }
    ]);
  };

  // Handler for editing an idea
  const handleEditIdea = (id, updatedIdea) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, ...updatedIdea } : idea
    ));
  };

  // Handler for deleting an idea
  const handleDeleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  // Handler for adding a new category
  const handleAddCategory = (newCategory) => {
    const id = Date.now();
    setCategories([...categories, { id, ...newCategory }]);
  };

  // Handler for changing view mode
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handler for updating session info
  const handleUpdateSessionInfo = (info) => {
    setSessionInfo({ ...sessionInfo, ...info });
  };

  return (
    <div className="session-workspace">
      <div className="session-header">
        <h1>{sessionInfo.title}</h1>
        <p>{sessionInfo.description}</p>
      </div>

      <WorkspaceToolbar 
        viewMode={viewMode} 
        onViewModeChange={handleViewModeChange} 
        onUpdateSessionInfo={handleUpdateSessionInfo}
      />

      <div className="workspace-content">
        <div className="sidebar">
          <CategoryList 
            categories={categories} 
            onAddCategory={handleAddCategory} 
          />
        </div>

        <div className="main-content">
          <IdeaForm onAddIdea={handleAddIdea} categories={categories} />
          
          <IdeaList 
            ideas={ideas} 
            categories={categories}
            viewMode={viewMode}
            onEditIdea={handleEditIdea}
            onDeleteIdea={handleDeleteIdea}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionWorkspace;