

class SessionService {
    constructor() {
      // Initialize with some sample sessions for testing
      this.sessions = {
        'ABC123': {
          title: 'Product Brainstorming',
          description: 'Ideas for our next product launch',
          isPublic: true,
          sessionCode: 'ABC123',
          createdAt: new Date(),
          ideas: [],
          categories: [
            { id: 1, name: 'Uncategorized', color: '#999999' },
            { id: 2, name: 'Feature Ideas', color: '#4CAF50' },
            { id: 3, name: 'Marketing', color: '#2196F3' }
          ]
        },
        'XYZ789': {
          title: 'Marketing Strategy Session',
          description: 'Q4 marketing campaign planning',
          isPublic: true,
          sessionCode: 'XYZ789',
          createdAt: new Date(),
          ideas: [],
          categories: [
            { id: 1, name: 'Uncategorized', color: '#999999' },
            { id: 2, name: 'Social Media', color: '#9C27B0' },
            { id: 3, name: 'Content', color: '#FF9800' }
          ]
        }
      };
  
      // History of sessions joined by the user
      this.sessionHistory = [];
    }
  
    // Generate a random session code (6 uppercase letters)
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
  
    // Create a new session
    createSession(sessionData) {
      const sessionCode = sessionData.sessionCode || this.generateSessionCode();
      const newSession = {
        ...sessionData,
        sessionCode,
        createdAt: new Date(),
        ideas: [],
        categories: sessionData.categories || [
          { id: 1, name: 'Uncategorized', color: '#999999' }
        ]
      };
      
      this.sessions[sessionCode] = newSession;
      this.addToHistory(sessionCode);
      return newSession;
    }
  
    // Join a session by code
    joinSession(sessionCode) {
      const normalizedCode = sessionCode.toUpperCase().trim();
      
      if (!this.sessions[normalizedCode]) {
        throw new Error(`Session with code ${normalizedCode} not found`);
      }
      
      const session = this.sessions[normalizedCode];
      
      if (!session.isPublic) {
        throw new Error('This session is private');
      }
      
      this.addToHistory(normalizedCode);
      return session;
    }
  
    // Get session by code
    getSession(sessionCode) {
      return this.sessions[sessionCode];
    }
  
    // Update an existing session
    updateSession(sessionCode, updateData) {
      if (!this.sessions[sessionCode]) {
        throw new Error(`Session with code ${sessionCode} not found`);
      }
      
      this.sessions[sessionCode] = {
        ...this.sessions[sessionCode],
        ...updateData
      };
      
      return this.sessions[sessionCode];
    }
  
    // Add an idea to a session
    addIdea(sessionCode, idea) {
      if (!this.sessions[sessionCode]) {
        throw new Error(`Session with code ${sessionCode} not found`);
      }
      
      const newIdea = {
        ...idea,
        id: Date.now(),
        createdAt: new Date(),
        votes: 0,
        author: idea.author || 'Anonymous User'
      };
      
      this.sessions[sessionCode].ideas.push(newIdea);
      return newIdea;
    }
  
    // Update an idea in a session
    updateIdea(sessionCode, ideaId, updateData) {
      if (!this.sessions[sessionCode]) {
        throw new Error(`Session with code ${sessionCode} not found`);
      }
      
      const ideaIndex = this.sessions[sessionCode].ideas.findIndex(idea => idea.id === ideaId);
      
      if (ideaIndex === -1) {
        throw new Error(`Idea with id ${ideaId} not found in session ${sessionCode}`);
      }
      
      this.sessions[sessionCode].ideas[ideaIndex] = {
        ...this.sessions[sessionCode].ideas[ideaIndex],
        ...updateData
      };
      
      return this.sessions[sessionCode].ideas[ideaIndex];
    }
  
    // Delete an idea from a session
    deleteIdea(sessionCode, ideaId) {
      if (!this.sessions[sessionCode]) {
        throw new Error(`Session with code ${sessionCode} not found`);
      }
      
      this.sessions[sessionCode].ideas = this.sessions[sessionCode].ideas.filter(idea => idea.id !== ideaId);
    }
  
    // Add a category to a session
    addCategory(sessionCode, category) {
      if (!this.sessions[sessionCode]) {
        throw new Error(`Session with code ${sessionCode} not found`);
      }
      
      const newCategory = {
        ...category,
        id: Date.now()
      };
      
      this.sessions[sessionCode].categories.push(newCategory);
      return newCategory;
    }
  
    // Add a session code to user's history
    addToHistory(sessionCode) {
      // Add to front if already exists
      this.sessionHistory = this.sessionHistory.filter(code => code !== sessionCode);
      this.sessionHistory.unshift(sessionCode);
      
      // Keep only the 10 most recent
      if (this.sessionHistory.length > 10) {
        this.sessionHistory = this.sessionHistory.slice(0, 10);
      }
    }
  
    // Get recent sessions
    getRecentSessions() {
      return this.sessionHistory.map(code => this.sessions[code]).filter(Boolean);
    }
  }
  
  // Export a singleton instance
  const sessionService = new SessionService();
  export default sessionService;