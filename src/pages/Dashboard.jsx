// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/EnhancedDashboard.css';
import Whiteboard from '../components/whiteboard/Whiteboard';
import IdeasPage from '../components/ideas/IdeasPage';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

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

const Dashboard = ({ 
  sessionData, 
  onExitSession,
  onUpdateSession,
  onAddIdea,
  onEditIdea,
  onDeleteIdea,
  onAddCategory
}) => {
  const [activeTab, setActiveTab] = useState(DashboardTabs.OVERVIEW);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [themeColor, setThemeColor] = useState('purple');
  const dashboardRef = useRef(null);
  
  // Theme color options
  const themeColors = {
    purple: {
      primary: '#6a11cb',
      secondary: '#2575fc',
      accent: '#8e2de2'
    },
    blue: {
      primary: '#0062E6',
      secondary: '#33AEFF',
      accent: '#007bff'
    },
    green: {
      primary: '#11998e',
      secondary: '#38ef7d',
      accent: '#1db954'
    },
    sunset: {
      primary: '#ff512f',
      secondary: '#f09819',
      accent: '#ff8a00'
    },
    nightsky: {
      primary: '#1a2a6c',
      secondary: '#2a3a7c',
      accent: '#3f51b5'
    }
  };
  
  // Apply theme color to CSS variables
  useEffect(() => {
    if (themeColors[themeColor]) {
      document.documentElement.style.setProperty('--primary-color', themeColors[themeColor].primary);
      document.documentElement.style.setProperty('--secondary-color', themeColors[themeColor].secondary);
      document.documentElement.style.setProperty('--accent-color', themeColors[themeColor].accent);
      
      // Also set RGB values for use in transparent backgrounds
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
      };
      
      document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(themeColors[themeColor].primary));
    }
  }, [themeColor]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (dashboardRef.current.requestFullscreen) {
        dashboardRef.current.requestFullscreen();
      } else if (dashboardRef.current.mozRequestFullScreen) {
        dashboardRef.current.mozRequestFullScreen();
      } else if (dashboardRef.current.webkitRequestFullscreen) {
        dashboardRef.current.webkitRequestFullscreen();
      } else if (dashboardRef.current.msRequestFullscreen) {
        dashboardRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
  
  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case DashboardTabs.OVERVIEW:
        return <OverviewTab sessionData={sessionData} themeColor={themeColor} />;
      
      case DashboardTabs.WHITEBOARD:
        return <Whiteboard />;
      
      case DashboardTabs.IDEAS:
        return (
          <IdeasPage 
            sessionData={sessionData}
            onAddIdea={onAddIdea}
            onEditIdea={onEditIdea}
            onDeleteIdea={onDeleteIdea}
          />
        );
      
      case DashboardTabs.VOTING:
        return <PlaceholderTab title="Voting & Prioritization" />;
      
      case DashboardTabs.DOCUMENTS:
        return <PlaceholderTab title="Documents & Resources" />;
      
      case DashboardTabs.CHAT:
        return <PlaceholderTab title="Team Chat" />;
      
      case DashboardTabs.SETTINGS:
        return (
          <SettingsTab 
            themeColor={themeColor} 
            setThemeColor={setThemeColor} 
            themeColors={Object.keys(themeColors)}
          />
        );
      
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
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  return (
    <div 
      ref={dashboardRef}
      className={`enhanced-dashboard ${isFullscreen ? 'fullscreen' : ''} theme-${themeColor}`}
    >
      <div className="dashboard-overlay"></div>
      
      {/* Sidebar */}
      <aside 
        className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
        style={{ width: isSidebarCollapsed ? '60px' : `${sidebarWidth}px` }}
      >
        <div className="sidebar-header">
          <h2 className="logo">
            {isSidebarCollapsed ? 'TB' : 'ThinkBox'}
            <span className="logo-dot"></span>
          </h2>
          <button 
            className="collapse-btn" 
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === DashboardTabs.OVERVIEW ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.OVERVIEW)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Overview</span>}
              {activeTab === DashboardTabs.OVERVIEW && <span className="active-indicator"></span>}
            </li>
            
            <li 
              className={activeTab === DashboardTabs.WHITEBOARD ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.WHITEBOARD)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.41999 2.00989L2.99999 3.41989L7.79999 8.21989L3.99999 12.0199L9.99999 18.0199L13.79 14.2199L18.59 19.0199L20 17.5999L4.41999 2.00989ZM13.34 12.0199L9.99999 15.3599L6.65999 12.0199L9.99999 8.67989L13.34 12.0199ZM9.99999 6.53989L7.04999 3.58989L9.99999 2.04989L12.94 3.58989L9.99999 6.53989ZM17.34 9.89989L14.39 6.94989L17.34 4.99989L20.28 6.94989L17.34 9.89989ZM19.36 18.3399L16.41 15.3899L14.46 17.3399L16.41 20.2899L19.36 18.3399Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Whiteboard</span>}
              {activeTab === DashboardTabs.WHITEBOARD && <span className="active-indicator"></span>}
            </li>
            
            <li 
              className={activeTab === DashboardTabs.IDEAS ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.IDEAS)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19Z" fill="currentColor"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Ideas</span>}
              {activeTab === DashboardTabs.IDEAS && <span className="active-indicator"></span>}
            </li>
            
            <li 
              className={activeTab === DashboardTabs.VOTING ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.VOTING)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13H17.32L15.32 15H17.23L19 17H5L6.78 15H8.83L6.83 13H6L3 16V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V16L18 13ZM17 7.95L12.05 12.9L8.51 9.36L13.46 4.41L17 7.95ZM12.76 2.29L6.39 8.66C6 9.05 6 9.68 6.39 10.07L11.34 15.02C11.73 15.41 12.36 15.41 12.75 15.02L19.11 8.66C19.5 8.27 19.5 7.64 19.11 7.25L14.16 2.3C13.78 1.9 13.15 1.9 12.76 2.29Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Voting</span>}
              {activeTab === DashboardTabs.VOTING && <span className="active-indicator"></span>}
            </li>
            
            <li 
              className={activeTab === DashboardTabs.DOCUMENTS ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.DOCUMENTS)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Documents</span>}
              {activeTab === DashboardTabs.DOCUMENTS && <span className="active-indicator"></span>}
            </li>
            
            <li 
              className={activeTab === DashboardTabs.CHAT ? 'active' : ''}
              onClick={() => setActiveTab(DashboardTabs.CHAT)}
            >
              <span className="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill="currentColor"/>
                </svg>
              </span>
              {!isSidebarCollapsed && <span className="nav-text">Chat</span>}
              {activeTab === DashboardTabs.CHAT && <span className="active-indicator"></span>}
            </li>
          </ul>
          
          <div className="sidebar-footer">
            <ul>
              <li 
                className={activeTab === DashboardTabs.SETTINGS ? 'active' : ''}
                onClick={() => setActiveTab(DashboardTabs.SETTINGS)}
              >
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
                  </svg>
                </span>
                {!isSidebarCollapsed && <span className="nav-text">Settings</span>}
                {activeTab === DashboardTabs.SETTINGS && <span className="active-indicator"></span>}
              </li>
              
              <li className="exit-session" onClick={handleExitSession}>
                <span className="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
                  </svg>
                </span>
                {!isSidebarCollapsed && <span className="nav-text">Exit Session</span>}
              </li>
            </ul>
          </div>
        </nav>
        
        {/* Resizable handle */}
        {!isSidebarCollapsed && (
          <div 
            className="resize-handle"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = sidebarWidth;
              
              const onMouseMove = (moveEvent) => {
                const newWidth = startWidth + moveEvent.clientX - startX;
                if (newWidth >= 180 && newWidth <= 400) {
                  setSidebarWidth(newWidth);
                }
              };
              
              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          ></div>
        )}
      </aside>
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>{sessionData?.title || 'Untitled Session'}</h1>
          </div>
          
          <div className="header-actions">
            <div className="session-code">
              <span>Session Code:</span>
              <strong>{sessionData?.sessionCode || 'XXXXXX'}</strong>
            </div>
            
            <button className="action-button invite-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V18H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
              </svg>
              <span>Invite Others</span>
            </button>
            
            <button 
              className="action-button fullscreen-btn"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 16H8V19H10V14H5V16ZM8 8H5V10H10V5H8V8ZM14 19H16V16H19V14H14V19ZM16 8V5H14V10H19V8H16Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" fill="currentColor"/>
                </svg>
              )}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
            
            <button className="action-button exit-btn" onClick={handleExitSession}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
              </svg>
              <span>Exit</span>
            </button>
          </div>
        </header>
        
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

// Enhanced Overview Tab Component
const OverviewTab = ({ sessionData, themeColor }) => {
  const [cardsLayout, setCardsLayout] = useState({
    info: { width: 350, height: 300 },
    actions: { width: 500, height: 300 },
    activity: { width: 400, height: 300 }
  });
  
  return (
    <div className="overview-tab">
      <div className="tab-header">
        <h2>Session Overview</h2>
        <div className="tab-actions">
          <span className="last-updated">Last updated: Just now</span>
        </div>
      </div>
      
      <div className="cards-container">
        <ResizableBox
          width={cardsLayout.info.width}
          height={cardsLayout.info.height}
          minConstraints={[300, 200]}
          maxConstraints={[800, 600]}
          className="resizable-card"
          onResize={(e, data) => {
            setCardsLayout({
              ...cardsLayout,
              info: { width: data.size.width, height: data.size.height }
            });
          }}
        >
          <div className="session-info-card">
            <div className="card-header">
              <h3>Session Information</h3>
              <div className="card-badge">{sessionData?.sessionCode || 'XXXXXX'}</div>
            </div>
            
            <div className="card-content">
              <div className="info-item">
                <span className="label">Title</span>
                <span className="value">{sessionData?.title || 'Untitled Session'}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Description</span>
                <span className="value">{sessionData?.description || 'No description provided.'}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Visibility</span>
                <span className="value visibility-badge">
                  <span className={`status-dot ${sessionData?.isPublic ? 'public' : 'private'}`}></span>
                  {sessionData?.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              
              <div className="info-item">
                <span className="label">Created</span>
                <span className="value timestamp">{new Date().toLocaleString()}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Participants</span>
                <div className="participants-avatars">
                  <div className="avatar" style={{ backgroundColor: '#FF5722' }}>JD</div>
                  <div className="avatar" style={{ backgroundColor: '#2196F3' }}>AT</div>
                  <div className="avatar" style={{ backgroundColor: '#4CAF50' }}>MS</div>
                  <div className="avatar avatar-more">+2</div>
                </div>
              </div>
            </div>
          </div>
        </ResizableBox>
        
        <ResizableBox
          width={cardsLayout.actions.width}
          height={cardsLayout.actions.height}
          minConstraints={[300, 200]}
          maxConstraints={[800, 600]}
          className="resizable-card"
          onResize={(e, data) => {
            setCardsLayout({
              ...cardsLayout,
              actions: { width: data.size.width, height: data.size.height }
            });
          }}
        >
          <div className="quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            
           
            
            <div className="card-content">
              <div className="action-grid">
                <div className="action-item">
                  <div className="action-icon whiteboard-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.41999 2.00989L2.99999 3.41989L7.79999 8.21989L3.99999 12.0199L9.99999 18.0199L13.79 14.2199L18.59 19.0199L20 17.5999L4.41999 2.00989ZM13.34 12.0199L9.99999 15.3599L6.65999 12.0199L9.99999 8.67989L13.34 12.0199ZM9.99999 6.53989L7.04999 3.58989L9.99999 2.04989L12.94 3.58989L9.99999 6.53989ZM17.34 9.89989L14.39 6.94989L17.34 4.99989L20.28 6.94989L17.34 9.89989ZM19.36 18.3399L16.41 15.3899L14.46 17.3399L16.41 20.2899L19.36 18.3399Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="action-title">Open Whiteboard</span>
                  <button className="action-button">Open</button>
                </div>
                
                <div className="action-item">
                  <div className="action-icon ideas-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.14 19 5 15.86 5 12C5 8.14 8.14 5 12 5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19Z" fill="currentColor"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="action-title">Add Ideas</span>
                  <button className="action-button">Add</button>
                </div>
                
                <div className="action-item">
                  <div className="action-icon invite-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V18H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="action-title">Invite Participants</span>
                  <button className="action-button">Invite</button>
                </div>
                
                <div className="action-item">
                  <div className="action-icon voting-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 13H17.32L15.32 15H17.23L19 17H5L6.78 15H8.83L6.83 13H6L3 16V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V16L18 13ZM17 7.95L12.05 12.9L8.51 9.36L13.46 4.41L17 7.95ZM12.76 2.29L6.39 8.66C6 9.05 6 9.68 6.39 10.07L11.34 15.02C11.73 15.41 12.36 15.41 12.75 15.02L19.11 8.66C19.5 8.27 19.5 7.64 19.11 7.25L14.16 2.3C13.78 1.9 13.15 1.9 12.76 2.29Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="action-title">Start Voting</span>
                  <button className="action-button">Start</button>
                </div>
              </div>
            </div>
          </div>
        </ResizableBox>
        
        <ResizableBox
          width={cardsLayout.activity.width}
          height={cardsLayout.activity.height}
          minConstraints={[300, 200]}
          maxConstraints={[800, 600]}
          className="resizable-card"
          onResize={(e, data) => {
            setCardsLayout({
              ...cardsLayout,
              activity: { width: data.size.width, height: data.size.height }
            });
          }}
        >
          <div className="activity-feed-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <div className="card-actions">
                <button className="refresh-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="card-content activity-list">
              <div className="activity-empty">
                <div className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM5 7H17V9H5V7ZM5 11H11V13H5V11ZM5 15H11V17H5V15Z" fill="currentColor" fillOpacity="0.3"/>
                  </svg>
                </div>
                <p>Session activities will appear here once you start collaborating.</p>
                <button className="start-activity-btn">Start an Activity</button>
              </div>
            </div>
          </div>
        </ResizableBox>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ themeColor, setThemeColor, themeColors }) => {
  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Settings</h2>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <div className="card-header">
            <h3>Appearance</h3>
          </div>
          
          <div className="card-content">
            <div className="setting-group">
              <label>Theme Color</label>
              <div className="theme-color-options">
                {themeColors.map(color => (
                  <button
                    key={color}
                    className={`theme-color-option ${color} ${themeColor === color ? 'active' : ''}`}
                    onClick={() => setThemeColor(color)}
                    aria-label={`${color} theme`}
                  />
                ))}
              </div>
            </div>
            
            <div className="setting-group">
              <label>UI Density</label>
              <div className="toggle-options">
                <button className="toggle-option active">Comfortable</button>
                <button className="toggle-option">Compact</button>
              </div>
            </div>
            
            <div className="setting-group">
              <label>Font Size</label>
              <div className="slider-control">
                <span>A</span>
                <input type="range" min="0" max="2" step="1" defaultValue="1" />
                <span>A</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-card">
          <div className="card-header">
            <h3>Session Settings</h3>
          </div>
          
          <div className="card-content">
            <div className="setting-group">
              <label>Session Visibility</label>
              <div className="toggle-switch">
                <input type="checkbox" id="visibility" defaultChecked={true} />
                <label htmlFor="visibility">Public</label>
              </div>
              <p className="setting-description">Public sessions can be joined by anyone with the code.</p>
            </div>
            
            <div className="setting-group">
              <label>Notifications</label>
              <div className="toggle-switch">
                <input type="checkbox" id="notifications" defaultChecked={true} />
                <label htmlFor="notifications">Enabled</label>
              </div>
            </div>
            
            <div className="setting-group danger-zone">
              <h4>Danger Zone</h4>
              <button className="danger-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                </svg>
                <span>Delete Session</span>
              </button>
            </div>
          </div>
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
        <div className="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.73 20.83L17.58 18L14.73 15.17L16.15 13.76L20.4 18L16.15 22.24L14.73 20.83ZM7.42 20.83L9.27 18L6.42 15.17L7.84 13.76L12.09 18L7.84 22.24L6.42 20.83Z" fill="currentColor" fillOpacity="0.3"/>
            <path d="M19.8 4H17.25V2H15.75V4H8.25V2H6.75V4H4.2C3.54 4 3 4.53 3 5.2V20.8C3 21.46 3.54 22 4.2 22H6V20H4.2V8H19.8V20H18V22H19.8C20.46 22 21 21.46 21 20.8V5.2C21 4.53 20.46 4 19.8 4Z" fill="currentColor" fillOpacity="0.3"/>
          </svg>
        </div>
        <h3>Coming Soon</h3>
        <p>This feature is under development and will be available soon!</p>
        <button className="notify-button">Notify Me When Ready</button>
      </div>
    </div>
  );
};

export default Dashboard;