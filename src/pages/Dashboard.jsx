import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Whiteboard from '../components/whiteboard/Whiteboard';

// Dashboard tabs enum
const DashboardTabs = {
  OVERVIEW: 'overview',
  WHITEBOARD: 'whiteboard',
  IDEAS: 'ideas',
  VOTING: 'voting',
  DOCUMENTS: 'documents',
  CHAT: 'chat',
  SETTINGS: 'settings',
};

const Dashboard = ({ sessionData, onExitSession }) => {
  const [activeTab, setActiveTab] = useState(DashboardTabs.OVERVIEW);
  
  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case DashboardTabs.OVERVIEW:
        return <OverviewTab sessionData={sessionData} />;
      
      case DashboardTabs.WHITEBOARD:
        return <Whiteboard />;
      
      case DashboardTabs.IDEAS:
        return <PlaceholderTab title="Ideas Collection" />;
      
      case DashboardTabs.VOTING:
        return <PlaceholderTab title="Voting & Prioritization" />;
      
      case DashboardTabs.DOCUMENTS:
        return <PlaceholderTab title="Documents & Resources" />;
      
      case DashboardTabs.CHAT:
        return <PlaceholderTab title="Team Chat" />;
      
      case DashboardTabs.SETTINGS:
        return <PlaceholderTab title="Session Settings" />;
      
      default:
        return <OverviewTab sessionData={sessionData} />;
    }
  };
  
  // Handle exiting the session
  const handleExitSession = () => {
    if (window.confirm('Are you sure you want to exit this session?')) {
      if (onExitSession) onExitSession();
    }
  };
  
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>ThinkBox</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === DashboardTabs.OVERVIEW ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.OVERVIEW)}
            >
              <span className="icon">📊</span>
              <span>Overview</span>
            </li>
            
            <li 
              className={activeTab === DashboardTabs.WHITEBOARD ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.WHITEBOARD)}
            >
              <span className="icon">🖌️</span>
              <span>Whiteboard</span>
            </li>
            
            <li 
              className={activeTab === DashboardTabs.IDEAS ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.IDEAS)}
            >
              <span className="icon">💡</span>
              <span>Ideas</span>
            </li>
            
            <li 
              className={activeTab === DashboardTabs.VOTING ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.VOTING)}
            >
              <span className="icon">🗳️</span>
              <span>Voting</span>
            </li>
            
            <li 
              className={activeTab === DashboardTabs.DOCUMENTS ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.DOCUMENTS)}
            >
              <span className="icon">📂</span>
              <span>Documents</span>
            </li>
            
            <li 
              className={activeTab === DashboardTabs.CHAT ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.CHAT)}
            >
              <span className="icon">💬</span>
              <span>Chat</span>
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <ul>
              <li 
                className={activeTab === DashboardTabs.SETTINGS ? 'active' : ''}
                onClick={() => setActiveTab(DashboardTabs.SETTINGS)}
              >
                <span className="icon">⚙️</span>
                <span>Settings</span>
              </li>
              
              <li className="exit-session" onClick={handleExitSession}>
                <span className="icon">🚪</span>
                <span>Exit Session</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>{sessionData?.title || 'Untitled Session'}</h1>
          <div className="header-actions">
            <div className="session-code">
              <span>Session Code:</span>
              <strong>{sessionData?.sessionCode || 'XXXXXX'}</strong>
            </div>
            <button className="invite-btn">Invite Others</button>
            <button className="exit-btn" onClick={handleExitSession}>Exit</button>
          </div>
        </header>
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ sessionData }) => {
  return (
    <div className="overview-tab scrollable-content">
      <div className="tab-header">
        <h2>Session Overview</h2>
      </div>
      
      <div className="session-info-card">
        <h3>Session Information</h3>
        <div className="info-item">
          <span className="label">Title:</span>
          <span className="value">{sessionData?.title || 'Untitled Session'}</span>
        </div>
        
        <div className="info-item">
          <span className="label">Description:</span>
          <span className="value">{sessionData?.description || 'No description provided.'}</span>
        </div>
        
        <div className="info-item">
          <span className="label">Session Code:</span>
          <span className="value code">{sessionData?.sessionCode || 'XXXXXX'}</span>
        </div>
        
        <div className="info-item">
          <span className="label">Visibility:</span>
          <span className="value">{sessionData?.isPublic ? 'Public' : 'Private'}</span>
        </div>
        
        <div className="info-item">
          <span className="label">Created:</span>
          <span className="value">{new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <div className="action-card" onClick={() => {}}>
            <span className="action-icon">🖌️</span>
            <span className="action-title">Open Whiteboard</span>
          </div>
          
          <div className="action-card" onClick={() => {}}>
            <span className="action-icon">💡</span>
            <span className="action-title">Add Ideas</span>
          </div>
          
          <div className="action-card" onClick={() => {}}>
            <span className="action-icon">👥</span>
            <span className="action-title">Invite Participants</span>
          </div>
          
          <div className="action-card" onClick={() => {}}>
            <span className="action-icon">📊</span>
            <span className="action-title">Start Voting</span>
          </div>
        </div>
      </div>
      
      <div className="activity-feed">
        <h3>Recent Activity</h3>
        <div className="activity-placeholder">
          <p>Session activities will appear here once you start collaborating.</p>
        </div>
      </div>
    </div>
  );
};

// Placeholder Tab Component
const PlaceholderTab = ({ title }) => {
  return (
    <div className="placeholder-tab">
      <div className="tab-header">
        <h2>{title}</h2>
      </div>
      
      <div className="placeholder-content">
        <div className="placeholder-icon">🚧</div>
        <h3>Coming Soon</h3>
        <p>This feature is under development and will be available soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;