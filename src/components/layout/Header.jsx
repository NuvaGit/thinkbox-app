import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>ThinkBox</h1>
        <span className="tagline">Collaborative Brainstorming Platform</span>
      </div>
      
      <nav className="header-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/session">Sessions</a></li>
          <li><a href="/create">Create New</a></li>
          {/* Login/Signup will be added later */}
          <li className="auth-placeholder">
            <button>Login / Sign Up</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;