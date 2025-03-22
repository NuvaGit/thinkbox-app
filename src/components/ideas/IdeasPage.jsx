// src/components/ideas/IdeasPage.jsx
import React, { useState, useEffect } from 'react';
import IdeaCard from './IdeaCard';
import NewIdeaForm from './NewIdeaForm';
import IdeasSidebar from './IdeasSidebar';
import '../../styles/IdeasPage.css';

const IdeasPage = ({ sessionData, onAddIdea, onEditIdea, onDeleteIdea }) => {
  const [activeView, setActiveView] = useState('all'); // 'all', 'pinned', 'archived', 'voting'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'votes', 'alphabetical'
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState(null);
  
  // Split ideas into pinned, archived, voting and regular
  const allIdeas = sessionData?.ideas || [];
  const pinnedIdeas = allIdeas.filter(idea => idea.isPinned);
  const archivedIdeas = allIdeas.filter(idea => idea.isArchived);
  const votingIdeas = allIdeas.filter(idea => idea.isInVoting);
  const regularIdeas = allIdeas.filter(idea => 
    !idea.isPinned && !idea.isArchived && !idea.isInVoting);
  
  // Get the active ideas based on current view
  const getActiveIdeas = () => {
    switch(activeView) {
      case 'pinned':
        return pinnedIdeas;
      case 'archived':
        return archivedIdeas;
      case 'voting':
        return votingIdeas;
      case 'all':
      default:
        return [...pinnedIdeas, ...regularIdeas]; // Show pinned first, then regular
    }
  };

  // Filter ideas based on search query and category
  const getFilteredIdeas = () => {
    const activeIdeas = getActiveIdeas();
    
    return activeIdeas.filter(idea => {
      // Text search
      const matchesSearch = 
        searchQuery === '' || 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (idea.description && idea.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = 
        filterCategory === 'all' || 
        idea.categoryId === parseInt(filterCategory);
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // Sort ideas based on selected sort method
  const getSortedIdeas = () => {
    const filteredIdeas = getFilteredIdeas();
    
    switch(sortBy) {
      case 'oldest':
        return [...filteredIdeas].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'votes':
        return [...filteredIdeas].sort((a, b) => b.votes - a.votes);
      case 'alphabetical':
        return [...filteredIdeas].sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return [...filteredIdeas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };
  
  // Handle idea actions
  const handlePinIdea = (ideaId) => {
    const idea = allIdeas.find(i => i.id === ideaId);
    onEditIdea(ideaId, { isPinned: !idea.isPinned });
  };
  
  const handleArchiveIdea = (ideaId) => {
    const idea = allIdeas.find(i => i.id === ideaId);
    onEditIdea(ideaId, { 
      isArchived: !idea.isArchived,
      // If we're un-archiving, make sure it's not in other special states
      isPinned: !idea.isArchived ? false : idea.isPinned,
      isInVoting: !idea.isArchived ? false : idea.isInVoting
    });
  };
  
  const handleVotingIdea = (ideaId) => {
    const idea = allIdeas.find(i => i.id === ideaId);
    onEditIdea(ideaId, { 
      isInVoting: !idea.isInVoting,
      // If we're adding to voting, make sure it's not in other special states
      isPinned: !idea.isInVoting ? false : idea.isPinned,
      isArchived: !idea.isInVoting ? false : idea.isArchived
    });
  };
  
  const handleIdeaVote = (ideaId, value) => {
    const idea = allIdeas.find(i => i.id === ideaId);
    const newVotes = Math.max(0, idea.votes + value);
    onEditIdea(ideaId, { votes: newVotes });
  };
  
  const handleAddIdea = (newIdea) => {
    // Add anonymous flag and status fields
    onAddIdea({
      ...newIdea,
      isAnonymous: newIdea.isAnonymous || false,
      isPinned: false,
      isArchived: false,
      isInVoting: false
    });
    
    setShowAddForm(false);
  };
  
  const handleExpandIdea = (ideaId) => {
    setExpandedIdea(expandedIdea === ideaId ? null : ideaId);
  };

  const sortedIdeas = getSortedIdeas();
  const categories = sessionData?.categories || [];
  
  return (
    <div className="ideas-page">
      <div className="ideas-header">
        <div className="ideas-title-row">
          <h1>Ideas</h1>
          <button 
            className="btn-add-idea" 
            onClick={() => setShowAddForm(true)}
          >
            <span className="btn-icon">+</span>
            Add Idea
          </button>
        </div>
        
        <div className="ideas-stats">
          <div className="stat-box">
            <div className="stat-value">{allIdeas.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{pinnedIdeas.length}</div>
            <div className="stat-label">Pinned</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{votingIdeas.length}</div>
            <div className="stat-label">In Voting</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{archivedIdeas.length}</div>
            <div className="stat-label">Archived</div>
          </div>
        </div>
        
        <div className="ideas-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >×</button>
            )}
          </div>
          
          <div className="filter-options">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="votes">Most Votes</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="ideas-content">
        <IdeasSidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          counts={{
            all: pinnedIdeas.length + regularIdeas.length,
            pinned: pinnedIdeas.length,
            archived: archivedIdeas.length,
            voting: votingIdeas.length
          }}
        />
        
        <div className="ideas-main">
          {sortedIdeas.length === 0 ? (
            <div className="no-ideas">
              <div className="empty-state">
                <div className="empty-icon">💡</div>
                <h3>No ideas found</h3>
                <p>{
                  searchQuery || filterCategory !== 'all' 
                    ? 'Try adjusting your filters' 
                    : activeView === 'all' 
                      ? 'Be the first to add an idea!' 
                      : `No ideas in the ${activeView} section yet`
                }</p>
                {activeView === 'all' && (
                  <button 
                    className="btn-add-first" 
                    onClick={() => setShowAddForm(true)}
                  >
                    Add Your First Idea
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="ideas-grid">
              {sortedIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  categories={categories}
                  isExpanded={expandedIdea === idea.id}
                  onExpand={() => handleExpandIdea(idea.id)}
                  onPin={() => handlePinIdea(idea.id)}
                  onArchive={() => handleArchiveIdea(idea.id)}
                  onVoting={() => handleVotingIdea(idea.id)}
                  onVote={handleIdeaVote}
                  onEdit={onEditIdea}
                  onDelete={onDeleteIdea}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showAddForm && (
        <div className="modal-overlay">
          <div className="idea-form-modal">
            <div className="modal-header">
              <h2>Add New Idea</h2>
              <button 
                className="close-modal"
                onClick={() => setShowAddForm(false)}
              >×</button>
            </div>
            <div className="modal-body">
              <NewIdeaForm 
                categories={categories}
                onSubmit={handleAddIdea}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeasPage;