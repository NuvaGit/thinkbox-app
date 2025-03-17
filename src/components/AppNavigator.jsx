import React, { useState } from 'react';
import LandingPage from '../pages/LandingPage';
import CreateSession from '../pages/CreateSession';
import Dashboard from '../pages/Dashboard';

// Page enum for navigation
export const Pages = {
  LANDING: 'landing',
  LOGIN: 'login', // Not implemented yet
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
  
  const handleCreateSession = (sessionData) => {
    setSessionData(sessionData);
    navigateTo(Pages.DASHBOARD);
  };
  
  const handleExitSession = () => {
    // Reset session data
    setSessionData(null);
    // Navigate back to landing page
    navigateTo(Pages.LANDING);
  };
  
  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case Pages.LANDING:
        return <LandingPage onEnter={() => navigateTo(Pages.CREATE_SESSION)} />;
        
      case Pages.CREATE_SESSION:
        return <CreateSession onCreateSession={handleCreateSession} />;
        
      case Pages.DASHBOARD:
        return <Dashboard 
          sessionData={sessionData} 
          onExitSession={handleExitSession} 
        />;
        
      default:
        return <LandingPage onEnter={() => navigateTo(Pages.CREATE_SESSION)} />;
    }
  };
  
  return (
    <div className="app-navigator">
      {renderPage()}
    </div>
  );
};

export default AppNavigator;