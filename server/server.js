// server.js
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 8080;

// Create an Express app for serving static files
const app = express();

// Enable CORS for all routes - important for development
app.use(cors());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store sessions data
const sessions = {};

// Client connections by sessionCode
const sessionClients = {};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  let clientSessionCode = null;

  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle different types of messages
      switch (data.type) {
        case 'join':
          // Client wants to join a session
          clientSessionCode = data.sessionCode;
          console.log(`Client joining session: ${clientSessionCode}`);
          
          // Initialize session clients array if it doesn't exist
          if (!sessionClients[clientSessionCode]) {
            sessionClients[clientSessionCode] = [];
          }
          
          // Add this client to the session
          sessionClients[clientSessionCode].push(ws);
          
          // Send the current session data to the client
          if (sessions[clientSessionCode]) {
            ws.send(JSON.stringify({
              type: 'session_data',
              sessionData: sessions[clientSessionCode]
            }));
          }
          break;
          
        case 'update_session':
          // Client is updating session data
          if (data.sessionCode && data.sessionData) {
            console.log(`Updating session: ${data.sessionCode}`);
            // Store the updated session data
            sessions[data.sessionCode] = data.sessionData;
            
            // Broadcast to all clients in this session except the sender
            if (sessionClients[data.sessionCode]) {
              sessionClients[data.sessionCode].forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'session_data',
                    sessionData: data.sessionData
                  }));
                }
              });
            }
          }
          break;
          
        case 'ping':
          // Respond to keep-alive pings
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
          
        default:
          console.log(`Received unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Remove client from the session
    if (clientSessionCode && sessionClients[clientSessionCode]) {
      const index = sessionClients[clientSessionCode].indexOf(ws);
      if (index !== -1) {
        sessionClients[clientSessionCode].splice(index, 1);
      }
      
      // Clean up empty sessions
      if (sessionClients[clientSessionCode].length === 0) {
        delete sessionClients[clientSessionCode];
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`WebSocket Server is running on port ${port}`);
});