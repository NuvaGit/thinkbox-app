import React, { useState, useEffect } from 'react';
import LandingPage from "../pages/LandingPage";
import SessionSelection from "../pages/SessionSelectionPage";
import CreateSession from "../pages/CreateSession";
import Dashboard from "../pages/Dashboard";
import sessionService from "../services/SessionService"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

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
  const [recentSessions, setRecentSessions] = useState([]);
  
  // Load recent sessions on mount
  useEffect(() => {
    setRecentSessions(sessionService.getRecentSessions());
  }, []);
  
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
    // Refresh recent sessions list
    setRecentSessions(sessionService.getRecentSessions());
  };
  
  const handleCreateSession = (sessionData) => {
    try {
      // Create the session using our service
      const newSession = sessionService.createSession(sessionData);
      setSessionData(newSession);
      
      // Show success message
      toast.success(`Session created with code: ${newSession.sessionCode}`, {
        position: "top-center",
        autoClose: 3000
      });
      
      navigateTo(Pages.DASHBOARD);
      
      // Update recent sessions
      setRecentSessions(sessionService.getRecentSessions());
    } catch (error) {
      toast.error(`Error creating session: ${error.message}`, {
        position: "top-center"
      });
    }
  };
  
  const handleJoinSession = (sessionCode) => {
    try {
      // Join the session using our service
      const joinedSession = sessionService.joinSession(sessionCode);
      setSessionData(joinedSession);
      
      // Show success message
      toast.success(`Joined session: ${joinedSession.title}`, {
        position: "top-center",
        autoClose: 3000
      });
      
      navigateTo(Pages.DASHBOARD);
      
      // Update recent sessions
      setRecentSessions(sessionService.getRecentSessions());
    } catch (error) {
      toast.error(`Error joining session: ${error.message}`, {
        position: "top-center"
      });
    }
  };
  
  const handleUpdateSession = (updatedData) => {
    if (!sessionData) return;
    
    try {
      // Update the session
      const updatedSession = sessionService.updateSession(
        sessionData.sessionCode, 
        updatedData
      );
      setSessionData(updatedSession);
      
      toast.success('Session updated successfully', {
        position: "top-center",
        autoClose: 2000
      });
    } catch (error) {
      toast.error(`Error updating session: ${error.message}`, {
        position: "top-center"
      });
    }
  };
  
  const handleAddIdea = (idea) => {
    if (!sessionData) return;
    
    try {
      // Add idea to the session
      const newIdea = sessionService.addIdea(sessionData.sessionCode, idea);
      
      // Update session data to include the new idea
      setSessionData({
        ...sessionData,
        ideas: [...(sessionData.ideas || []), newIdea]
      });
      
      toast.success('Idea added successfully', {
        position: "bottom-right",
        autoClose: 2000
      });
      
      return newIdea;
    } catch (error) {
      toast.error(`Error adding idea: ${error.message}`, {
        position: "bottom-right"
      });
      return null;
    }
  };
  
  const handleEditIdea = (ideaId, updatedIdea) => {
    if (!sessionData) return;
    
    try {
      // Update the idea
      const updatedIdeaData = sessionService.updateIdea(
        sessionData.sessionCode, 
        ideaId, 
        updatedIdea
      );
      
      // Update session data with the edited idea
      setSessionData({
        ...sessionData,
        ideas: sessionData.ideas.map(idea => 
          idea.id === ideaId ? { ...idea, ...updatedIdea } : idea
        )
      });
      
      return updatedIdeaData;
    } catch (error) {
      toast.error(`Error updating idea: ${error.message}`, {
        position: "bottom-right"
      });
      return null;
    }
  };
  
  const handleDeleteIdea = (ideaId) => {
    if (!sessionData) return;
    
    try {
      // Delete the idea
      sessionService.deleteIdea(sessionData.sessionCode, ideaId);
      
      // Update session data without the deleted idea
      setSessionData({
        ...sessionData,
        ideas: sessionData.ideas.filter(idea => idea.id !== ideaId)
      });
      
      toast.info('Idea deleted', {
        position: "bottom-right",
        autoClose: 2000
      });
    } catch (error) {
      toast.error(`Error deleting idea: ${error.message}`, {
        position: "bottom-right"
      });
    }
  };
  
  const handleAddCategory = (category) => {
    if (!sessionData) return;
    
    try {
      // Add category to the session
      const newCategory = sessionService.addCategory(sessionData.sessionCode, category);
      
      // Update session data to include the new category
      setSessionData({
        ...sessionData,
        categories: [...(sessionData.categories || []), newCategory]
      });
      
      toast.success('Category added successfully', {
        position: "bottom-right",
        autoClose: 2000
      });
      
      return newCategory;
    } catch (error) {
      toast.error(`Error adding category: ${error.message}`, {
        position: "bottom-right"
      });
      return null;
    }
  };
  
  const handleExitSession = () => {
    // Reset session data
    setSessionData(null);
    // Navigate back to session selection page
    navigateTo(Pages.SESSION_SELECTION);
    // Refresh recent sessions list
    setRecentSessions(sessionService.getRecentSessions());
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
          recentSessions={recentSessions}
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
          onUpdateSession={handleUpdateSession}
          onAddIdea={handleAddIdea}
          onEditIdea={handleEditIdea}
          onDeleteIdea={handleDeleteIdea}
          onAddCategory={handleAddCategory}
        />;
        
      default:
        return <LandingPage onEnter={handleEnterApp} />;
    }
  };
  
  return (
    <div className="app-navigator">
      {renderPage()}
      <ToastContainer />
    </div>
  );
};

export default AppNavigator;