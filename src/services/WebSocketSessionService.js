// src/services/WebSocketSessionService.js
import webSocketService from './WebSocketService';

class WebSocketSessionService {
  constructor() {
    // Initialize sessions data
    this.sessions = {};
    this.sessionHistory = [];
    
    // Callbacks for components to subscribe to updates
    this.changeListeners = new Map();
    
    // Set up WebSocket listeners
    this.setupWebSocketListeners();
    
    // Try to load session history from localStorage
    this.loadSessionHistory();
  }
  
  /**
   * Set up WebSocket listeners
   */
  setupWebSocketListeners() {
    // Listen for session data updates from the server
    webSocketService.addMessageListener('session_data', (sessionData) => {
      if (sessionData && sessionData.sessionCode) {
        this.sessions[sessionData.sessionCode] = sessionData;
        this.notifyChangeListeners(sessionData.sessionCode, 'external');
      }
    });
    
    // Listen for connection status changes
    webSocketService.addMessageListener('connection', (status) => {
      // When reconnected, rejoin the current session
      if (status.connected && this.currentSessionCode) {
        webSocketService.joinSession(this.currentSessionCode);
      }
    });
  }
  
  /**
   * Load session history from localStorage
   */
  loadSessionHistory() {
    try {
      const savedHistory = localStorage.getItem('thinkbox-session-history');
      this.sessionHistory = savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Error loading session history:', error);
      this.sessionHistory = [];
    }
  }
  
  /**
   * Save session history to localStorage
   */
  saveSessionHistory() {
    try {
      localStorage.setItem('thinkbox-session-history', JSON.stringify(this.sessionHistory));
    } catch (error) {
      console.error('Error saving session history:', error);
    }
  }
  
  /**
   * Generate a random session code (6 uppercase letters)
   */
  generateSessionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Make sure it doesn't collide with existing codes
    if (this.sessions[code]) {
      return this.generateSessionCode(); // Generate a new one if collision
    }
    
    return code;
  }
  
  /**
   * Subscribe to session changes
   * @param {string} sessionCode - The session code to subscribe to
   * @param {Function} callback - The callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToChanges(sessionCode, callback) {
    if (!this.changeListeners.has(sessionCode)) {
      this.changeListeners.set(sessionCode, new Set());
    }
    
    this.changeListeners.get(sessionCode).add(callback);
    
    // Return a function to remove this listener
    return () => {
      const listeners = this.changeListeners.get(sessionCode);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.changeListeners.delete(sessionCode);
        }
      }
    };
  }
  
  /**
   * Notify all listeners for a specific session
   * @param {string} sessionCode - The session code
   * @param {string} source - The source of the change ('self' or 'external')
   */
  notifyChangeListeners(sessionCode, source) {
    const listeners = this.changeListeners.get(sessionCode);
    if (listeners) {
      const sessionData = this.sessions[sessionCode];
      listeners.forEach(callback => {
        try {
          callback(sessionData, source);
        } catch (error) {
          console.error(`Error in session change listener:`, error);
        }
      });
    }
  }
  
  /**
   * Create a new session
   */
  createSession(sessionData) {
    const sessionCode = sessionData.sessionCode || this.generateSessionCode();
    const newSession = {
      ...sessionData,
      sessionCode,
      createdAt: new Date().toISOString(),
      ideas: [],
      categories: sessionData.categories || [
        { id: 1, name: 'Uncategorized', color: '#999999' }
      ]
    };
    
    // Store locally
    this.sessions[sessionCode] = newSession;
    
    // Add to history
    this.addToHistory(sessionCode);
    
    // Connect to the session via WebSocket
    this.currentSessionCode = sessionCode;
    webSocketService.joinSession(sessionCode);
    
    // Update the server
    webSocketService.updateSession(sessionCode, newSession);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
    
    return newSession;
  }
  
  /**
   * Join a session by code
   */
  joinSession(sessionCode) {
    const normalizedCode = sessionCode.toUpperCase().trim();
    
    // Connect to the session via WebSocket
    this.currentSessionCode = normalizedCode;
    webSocketService.joinSession(normalizedCode);
    
    // Add to history
    this.addToHistory(normalizedCode);
    
    // If we already have this session cached locally
    if (this.sessions[normalizedCode]) {
      return this.sessions[normalizedCode];
    }
    
    // Return a temporary session object
    // It will be updated with real data when the server responds
    return {
      sessionCode: normalizedCode,
      title: 'Loading...',
      description: 'Connecting to session...',
      ideas: [],
      categories: [
        { id: 1, name: 'Uncategorized', color: '#999999' }
      ],
      isLoading: true
    };
  }
  
  /**
   * Get session by code
   */
  getSession(sessionCode) {
    return this.sessions[sessionCode] || null;
  }
  
  /**
   * Update an existing session
   */
  updateSession(sessionCode, updateData) {
    if (!this.sessions[sessionCode]) {
      throw new Error(`Session with code ${sessionCode} not found`);
    }
    
    // Update local data
    this.sessions[sessionCode] = {
      ...this.sessions[sessionCode],
      ...updateData
    };
    
    // Update server
    webSocketService.updateSession(sessionCode, this.sessions[sessionCode]);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
    
    return this.sessions[sessionCode];
  }
  
  /**
   * Add an idea to a session
   */
  addIdea(sessionCode, idea) {
    if (!this.sessions[sessionCode]) {
      throw new Error(`Session with code ${sessionCode} not found`);
    }
    
    const newIdea = {
      ...idea,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      votes: 0,
      author: idea.author || 'Anonymous User',
      isPinned: idea.isPinned || false,
      isArchived: idea.isArchived || false,
      isInVoting: idea.isInVoting || false,
      isAnonymous: idea.isAnonymous || false
    };
    
    if (!this.sessions[sessionCode].ideas) {
      this.sessions[sessionCode].ideas = [];
    }
    
    // Add to local data
    this.sessions[sessionCode].ideas.push(newIdea);
    
    // Update server
    webSocketService.updateSession(sessionCode, this.sessions[sessionCode]);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
    
    return newIdea;
  }
  
  /**
   * Update an idea in a session
   */
  updateIdea(sessionCode, ideaId, updateData) {
    if (!this.sessions[sessionCode]) {
      throw new Error(`Session with code ${sessionCode} not found`);
    }
    
    const ideaIndex = this.sessions[sessionCode].ideas.findIndex(idea => idea.id === ideaId);
    
    if (ideaIndex === -1) {
      throw new Error(`Idea with id ${ideaId} not found in session ${sessionCode}`);
    }
    
    // Update local data
    this.sessions[sessionCode].ideas[ideaIndex] = {
      ...this.sessions[sessionCode].ideas[ideaIndex],
      ...updateData
    };
    
    // Update server
    webSocketService.updateSession(sessionCode, this.sessions[sessionCode]);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
    
    return this.sessions[sessionCode].ideas[ideaIndex];
  }
  
  /**
   * Delete an idea from a session
   */
  deleteIdea(sessionCode, ideaId) {
    if (!this.sessions[sessionCode]) {
      throw new Error(`Session with code ${sessionCode} not found`);
    }
    
    // Update local data
    this.sessions[sessionCode].ideas = this.sessions[sessionCode].ideas.filter(idea => idea.id !== ideaId);
    
    // Update server
    webSocketService.updateSession(sessionCode, this.sessions[sessionCode]);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
  }
  
  /**
   * Add a category to a session
   */
  addCategory(sessionCode, category) {
    if (!this.sessions[sessionCode]) {
      throw new Error(`Session with code ${sessionCode} not found`);
    }
    
    const newCategory = {
      ...category,
      id: Date.now()
    };
    
    if (!this.sessions[sessionCode].categories) {
      this.sessions[sessionCode].categories = [];
    }
    
    // Update local data
    this.sessions[sessionCode].categories.push(newCategory);
    
    // Update server
    webSocketService.updateSession(sessionCode, this.sessions[sessionCode]);
    
    // Notify local listeners
    this.notifyChangeListeners(sessionCode, 'self');
    
    return newCategory;
  }
  
  /**
   * Add a session code to user's history
   */
  addToHistory(sessionCode) {
    // Add to front if already exists
    this.sessionHistory = this.sessionHistory.filter(code => code !== sessionCode);
    this.sessionHistory.unshift(sessionCode);
    
    // Keep only the 10 most recent
    if (this.sessionHistory.length > 10) {
      this.sessionHistory = this.sessionHistory.slice(0, 10);
    }
    
    // Save to localStorage
    this.saveSessionHistory();
  }
  
  /**
   * Get recent sessions
   */
  getRecentSessions() {
    return this.sessionHistory
      .map(code => this.getSession(code))
      .filter(Boolean);
  }
  
  /**
   * Leave the current session
   */
  leaveSession() {
    this.currentSessionCode = null;
  }
}

// Export singleton instance
const webSocketSessionService = new WebSocketSessionService();

// Connect to WebSocket server on initialization
webSocketService.connect();

export default webSocketSessionService;