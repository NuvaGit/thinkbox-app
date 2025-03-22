// electron.cjs
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { startWebSocketServer } = require('./server/embedded-server.cjs');

// WebSocket server instance
let wsServer = null;
const WS_PORT = 8080;

// Create the browser window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load the app
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      });
  
  mainWindow.loadURL(startUrl);

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Set WebSocket URL environment variable for the renderer process
  process.env.VITE_WS_URL = `ws://localhost:${WS_PORT}`;
  
  return mainWindow;
}

// Start the app
app.whenReady().then(() => {
  // Start the WebSocket server
  try {
    wsServer = startWebSocketServer(WS_PORT);
    console.log(`WebSocket server started on port ${WS_PORT}`);
  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
  }
  
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    // Close the WebSocket server if it's running
    if (wsServer) {
      wsServer.close(() => {
        console.log('WebSocket server closed');
      });
    }
    app.quit();
  }
});

// On macOS, re-create a window when dock icon is clicked
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Handle IPC messages from renderer
ipcMain.on('app-ready', (event) => {
  // Send WebSocket URL to the renderer
  event.reply('ws-url', `ws://localhost:${WS_PORT}`);
});