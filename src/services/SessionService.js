

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
          ideas: [
            {
              id: 1,
              title: 'Add AI-powered recommendation system',
              description: 'Implement machine learning to suggest relevant content based on user behavior and preferences.',
              categoryId: 2,
              author: 'Alex Chen',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              votes: 12,
              isPinned: true,
              isArchived: false,
              isInVoting: false,
              isAnonymous: false
            },
            {
              id: 2,
              title: 'Mobile app with offline mode',
              description: 'Create a mobile application that allows users to access and work with their data even without an internet connection.',
              categoryId: 2,
              author: 'Anonymous User',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              votes: 8,
              isPinned: false,
              isArchived: false,
              isInVoting: true,
              isAnonymous: true
            },
            {
              id: 3,
              title: 'Launch referral program',
              description: 'Implement a referral system where users earn rewards for bringing in new customers.',
              categoryId: 3,
              author: 'Maya Johnson',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              votes: 5,
              isPinned: false,
              isArchived: true,
              isInVoting: false,
              isAnonymous: false
            },
            {
              id: 4,
              title: 'Integrate with popular third-party tools',
              description: 'Add integrations with tools like Slack, Trello, and Google Workspace to enhance productivity.',
              categoryId: 2,
              author: 'Theo Williams',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              votes: 9,
              isPinned: false,
              isArchived: false,
              isInVoting: false,
              isAnonymous: false
            }
          ],
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
          ideas: [
            {
              id: 5,
              title: 'Holiday-themed social media campaign',
              description: 'Create a series of engaging posts featuring holiday themes to boost engagement during Q4.',
              categoryId: 2,
              author: 'Jamie Lee',
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
              votes: 7,
              isPinned: true,
              isArchived: false,
              isInVoting: false,
              isAnonymous: false
            },
            {
              id: 6,
              title: 'Influencer partnerships',
              description: 'Collaborate with niche influencers to reach targeted audience segments.',
              categoryId: 2,
              author: 'Anonymous User',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              votes: 11,
              isPinned: false,
              isArchived: false,
              isInVoting: true,
              isAnonymous: true
            },
            {
              id: 7,
              title: 'Email campaign automation',
              description: 'Set up automated email sequences based on user behavior to increase conversions.',
              categoryId: 3,
              author: 'Sam Peterson',
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
              votes: 4,
              isPinned: false,
              isArchived: false,
              isInVoting: false,
              isAnonymous: false
            }
          ],
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
        author: idea.author || 'Anonymous User',
        isPinned: idea.isPinned || false,
        isArchived: idea.isArchived || false,
        isInVoting: idea.isInVoting || false,
        isAnonymous: idea.isAnonymous || false
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