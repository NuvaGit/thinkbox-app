// src/components/ideas/IdeasSidebar.jsx
import React from 'react';

const IdeasSidebar = ({ activeView, setActiveView, counts }) => {
  const views = [
    { id: 'all', name: 'All Ideas', icon: '💡', count: counts.all },
    { id: 'pinned', name: 'Pinned', icon: '📌', count: counts.pinned },
    { id: 'voting', name: 'In Voting', icon: '🗳️', count: counts.voting },
    { id: 'archived', name: 'Archived', icon: '🗄️', count: counts.archived }
  ];
  
  return (
    <div className="ideas-sidebar">
      <div className="sidebar-header">
        <h3>Views</h3>
      </div>
      
      <ul className="sidebar-views">
        {views.map(view => (
          <li 
            key={view.id}
            className={`view-item ${activeView === view.id ? 'active' : ''}`}
            onClick={() => setActiveView(view.id)}
          >
            <span className="view-icon">{view.icon}</span>
            <span className="view-name">{view.name}</span>
            <span className="view-count">{view.count}</span>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-tips">
        <div className="tip-header">Tips</div>
        <div className="tip-content">
          <p>📌 <strong>Pin</strong> important ideas to keep them at the top</p>
          <p>🗳️ <strong>Voting</strong> helps prioritize the best ideas</p>
          <p>🗄️ <strong>Archive</strong> ideas you've already addressed</p>
        </div>
      </div>
    </div>
  );
};

export default IdeasSidebar;