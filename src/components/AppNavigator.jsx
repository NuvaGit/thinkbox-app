import React, { useState } from 'react';
import LandingPage from "../pages/LandingPage";
import SessionSelection from "../pages/SessionSelectionPage"; // Fixed path
import CreateSession from "../pages/CreateSession";
import Dashboard from "../pages/Dashboard";

// Page enum for navigation
export const Pages = {
  LANDING: 'landing',
  LOGIN: 'login', // Not implemented yet
  SESSION_SELECTION: 'session_selection',
  CREATE_SESSION: 'create_session',
  DASHBOARD: 'dashboard'
};

const AppNavigator = () => {
  const [currentPage, setCurrentPage] = useState(Pages.LANDING);
  const [sessionData, setSessionData] = useState(null);
  
  // Navigation handlers
  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  const handleEnterApp = () => {
    navigateTo(Pages.SESSION_SELECTION);
  };
  
  const handleNavigateToCreate = () => {
    navigateTo(Pages.CREATE_SESSION);
  };
  
  const handleBackToSelection = () => {
    navigateTo(Pages.SESSION_SELECTION);
  };
  
  const handleCreateSession = (sessionData) => {
    setSessionData(sessionData);
    navigateTo(Pages.DASHBOARD);
  };
  
  const handleJoinSession = (sessionCode) => {
    // Here you would typically validate the session code and fetch session data
    // For now, we'll create a simple session object with the code
    const joinedSession = {
      title: `Joined Session (${sessionCode})`,
      description: '',
      isPublic: true,
      sessionCode: sessionCode
    };
    
    setSessionData(joinedSession);
    navigateTo(Pages.DASHBOARD);
  };
  
  const handleExitSession = () => {
    // Reset session data
    setSessionData(null);
    // Navigate back to session selection page
    navigateTo(Pages.SESSION_SELECTION);
  };
  
  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case Pages.LANDING:
        return <LandingPage onEnter={handleEnterApp} />;
        
      case Pages.SESSION_SELECTION:
        return <SessionSelection 
          onCreateSession={handleNavigateToCreate}
          onJoinSession={handleJoinSession}
        />;
        
      case Pages.CREATE_SESSION:
        return <CreateSession 
          onCreateSession={handleCreateSession} 
          onBack={handleBackToSelection}
        />;
        
      case Pages.DASHBOARD:
        return <Dashboard
          sessionData={sessionData}
          onExitSession={handleExitSession}
        />;
        
      default:
        return <LandingPage onEnter={handleEnterApp} />;
    }
  };
  
  return (
    <div className="app-navigator">
      {renderPage()}
    </div>
  );
};

export default AppNavigator;