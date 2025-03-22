// src/services/WebSocketService.js
class WebSocketService {
    constructor() {
      this.ws = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = null;
      this.messageListeners = new Map();
      this.isConnected = false;
      this.currentSessionCode = null;
      
      // Initialize WebSocket URL (will be set in connect method)
      this.wsUrl = null;
      
      // Check if we're running in Electron
      this.isElectron = window.electron && window.electron.isElectron;
    }
    
    /**
     * Connect to the WebSocket server
     */
    async connect() {
      if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
        return; // Already connecting or connected
      }
      
      console.log('Connecting to WebSocket server...');
      
      try {
        // Get WebSocket URL - check multiple sources
        if (!this.wsUrl) {
          if (this.isElectron) {
            // Get URL from Electron main process
            try {
              this.wsUrl = await window.electron.getWebSocketUrl();
              console.log(`Got WebSocket URL from Electron: ${this.wsUrl}`);
            } catch (error) {
              console.warn('Failed to get WebSocket URL from Electron, using default');
              this.wsUrl = 'ws://localhost:8080';
            }
          } else {
            // Get URL from Vite environment variable or use default
            this.wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
          }
        }
        
        this.ws = new WebSocket(this.wsUrl);
        
        this.ws.onopen = () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Start ping interval to keep the connection alive
          this.startPingInterval();
          
          // If we have a session code, join it immediately
          if (this.currentSessionCode) {
            this.joinSession(this.currentSessionCode);
          }
          
          // Notify listeners
          this.notifyListeners('connection', { connected: true });
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            // Handle specific message types
            if (message.type === 'session_data') {
              this.notifyListeners('session_data', message.sessionData);
            } else if (message.type === 'pong') {
              // Handle pong (keep-alive response)
            } else {
              // Handle other message types
              this.notifyListeners(message.type, message);
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
        
        this.ws.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          this.isConnected = false;
          this.clearPingInterval();
          
          // Notify listeners
          this.notifyListeners('connection', { connected: false });
          
          // Attempt to reconnect if the connection was closed unexpectedly
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyListeners('error', error);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.scheduleReconnect();
      }
    }
    
    /**
     * Schedule a reconnection attempt
     */
    scheduleReconnect() {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
      this.reconnectAttempts++;
      
      console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    }
    
    /**
     * Disconnect from the WebSocket server
     */
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      this.isConnected = false;
      this.clearPingInterval();
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
    
    /**
     * Start the ping interval to keep the connection alive
     */
    startPingInterval() {
      this.pingInterval = setInterval(() => {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000); // Send a ping every 30 seconds
    }
    
    /**
     * Clear the ping interval
     */
    clearPingInterval() {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
    
    /**
     * Join a session
     * @param {string} sessionCode - The code of the session to join
     */
    joinSession(sessionCode) {
      if (!sessionCode) return;
      
      this.currentSessionCode = sessionCode;
      
      if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'join',
          sessionCode
        }));
      } else {
        // Not connected, try to connect first
        this.connect();
      }
    }
    
    /**
     * Update session data
     * @param {string} sessionCode - The code of the session to update
     * @param {Object} sessionData - The updated session data
     */
    updateSession(sessionCode, sessionData) {
      if (!this.isConnected || this.ws.readyState !== WebSocket.OPEN) {
        console.warn('Cannot update session: WebSocket not connected');
        return false;
      }
      
      try {
        this.ws.send(JSON.stringify({
          type: 'update_session',
          sessionCode,
          sessionData
        }));
        return true;
      } catch (error) {
        console.error('Error sending session update:', error);
        return false;
      }
    }
    
    /**
     * Add a message listener
     * @param {string} type - The message type to listen for
     * @param {Function} callback - The callback function
     * @returns {Function} A function to remove the listener
     */
    addMessageListener(type, callback) {
      if (!this.messageListeners.has(type)) {
        this.messageListeners.set(type, new Set());
      }
      
      this.messageListeners.get(type).add(callback);
      
      // Return a function to remove this listener
      return () => {
        const listeners = this.messageListeners.get(type);
        if (listeners) {
          listeners.delete(callback);
          if (listeners.size === 0) {
            this.messageListeners.delete(type);
          }
        }
      };
    }
    
    /**
     * Notify all listeners of a specific message type
     * @param {string} type - The message type
     * @param {*} data - The message data
     */
    notifyListeners(type, data) {
      const listeners = this.messageListeners.get(type);
      if (listeners) {
        listeners.forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in ${type} listener:`, error);
          }
        });
      }
    }
  }
  
  // Export singleton instance
  const webSocketService = new WebSocketService();
  export default webSocketService;