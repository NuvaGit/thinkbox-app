// preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Send message to main process
  sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  
  // Receive messages from main process
  onMessage: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  
  // Get WebSocket URL - this is a one-time operation
  getWebSocketUrl: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('app-ready');
      ipcRenderer.once('ws-url', (event, url) => {
        resolve(url);
      });
    });
  },
  
  // Check if running in Electron
  isElectron: true
});