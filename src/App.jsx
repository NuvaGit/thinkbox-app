import React from 'react';
import './App.css';
import AppNavigator from './components/AppNavigator';

// Import all required styles
import './styles/globals.css';
import './styles/thinkbox.css';

function App() {
  return (
    <div className="app">
      <AppNavigator />
    </div>
  );
}

export default App;