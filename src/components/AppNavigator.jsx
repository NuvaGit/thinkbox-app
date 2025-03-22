import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from "../pages/LandingPage";
import SessionSelection from "../pages/SessionSelectionPage";
import CreateSession from "../pages/CreateSession";
import Dashboard from "../pages/Dashboard";
import webSocketSessionService from "../services/WebSocketSessionService"; 
import webSocketService from "../services/WebSocketService";
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
  const [isConnected, setIsConnected] = useState(false);
  
  // Load recent sessions on mount
  useEffect(() => {
    setRecentSessions(webSocketSessionService.getRecentSessions());
    
    // Connect to WebSocket server
    webSocketService.connect();
    
    // Listen for connection status changes
    const removeConnectionListener = webSocketService.addMessageListener('connection', (status) => {
      setIsConnected(status.connected);
      
      if (status.connected) {
        toast.success('Connected to server', {
          position: "bottom-right",
          autoClose: 2000
        });
      } else {
        toast.warning('Disconnected from server', {
          position: "bottom-right",
          autoClose: 2000
        });
      }
    });
    
    return () => {
      removeConnectionListener();
    };
  }, []);
  
  // Handle session data updates
  const handleSessionUpdate = useCallback((newSessionData, source) => {
    if (newSessionData) {
      setSessionData(newSessionData);
      
      if (source === 'external') {
        toast.info('Session updated by another user', {
          position: "bottom-right",
          autoClose: 2000
        });
      }
    }
  }, []);
  
  // Subscribe to session updates when session changes
  useEffect(() => {
    if (sessionData && sessionData.sessionCode) {
      const unsubscribe = webSocketSessionService.subscribeToChanges(
        sessionData.sessionCode,
        handleSessionUpdate
      );
      
      return () => {
        unsubscribe();
      };
    }
  }, [sessionData, handleSessionUpdate]);
  
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
    setRecentSessions(webSocketSessionService.getRecentSessions());
  };
  
  const handleCreateSession = (sessionData) => {
    try {
      // Create the session using our service
      const newSession = webSocketSessionService.createSession(sessionData);
      setSessionData(newSession);
      
      // Show success message
      toast.success(`Session created with code: ${newSession.sessionCode}`, {
        position: "top-center",
        autoClose: 3000
      });
      
      navigateTo(Pages.DASHBOARD);
      
      // Update recent sessions
      setRecentSessions(webSocketSessionService.getRecentSessions());
    } catch (error) {
      toast.error(`Error creating session: ${error.message}`, {
        position: "top-center"
      });
    }
  };
  
  const handleJoinSession = (sessionCode) => {
    try {
      // Join the session using our service
      const joinedSession = webSocketSessionService.joinSession(sessionCode);
      setSessionData(joinedSession);
      
      // Show success message
      toast.success(`Joining session: ${sessionCode}`, {
        position: "top-center",
        autoClose: 3000
      });
      
      navigateTo(Pages.DASHBOARD);
      
      // Update recent sessions
      setRecentSessions(webSocketSessionService.getRecentSessions());
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
      const updatedSession = webSocketSessionService.updateSession(
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
      const newIdea = webSocketSessionService.addIdea(sessionData.sessionCode, idea);
      
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
      const updatedIdeaData = webSocketSessionService.updateIdea(
        sessionData.sessionCode, 
        ideaId, 
        updatedIdea
      );
      
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
      webSocketSessionService.deleteIdea(sessionData.sessionCode, ideaId);
      
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
      const newCategory = webSocketSessionService.addCategory(sessionData.sessionCode, category);
      
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
    // Leave the current session
    webSocketSessionService.leaveSession();
    
    // Reset session data
    setSessionData(null);
    
    // Navigate back to session selection page
    navigateTo(Pages.SESSION_SELECTION);
    
    // Refresh recent sessions list
    setRecentSessions(webSocketSessionService.getRecentSessions());
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
      
      {/* Connection status indicator */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-indicator"></div>
        <span className="status-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
};

export default AppNavigator;