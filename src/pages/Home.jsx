import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="home-content">
        <section className="hero">
          <div className="hero-content">
            <h1>Collaborative Brainstorming Made Simple</h1>
            <p className="hero-subtitle">
              ThinkBox helps teams capture, organize, and prioritize ideas in real-time.
              Unleash your collective creativity and make better decisions together.
            </p>
            <div className="hero-actions">
              <Link to="/create" className="btn btn-primary btn-lg">
                Start Brainstorming
              </Link>
              <Link to="/session" className="btn btn-outline btn-lg">
                Join a Session
              </Link>
            </div>
          </div>
          <div className="hero-image">
            {/* We'll add an illustration here later */}
            <div className="placeholder-image">ThinkBox</div>
          </div>
        </section>
        
        <section className="features">
          <div className="section-header">
            <h2>Powerful Brainstorming Features</h2>
            <p>Everything you need to drive innovation and collaboration</p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Real-time Collaboration</h3>
              <p>Work together simultaneously with your team, seeing ideas appear as they're created.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Voting & Prioritization</h3>
              <p>Use various voting mechanisms to quickly identify the most promising ideas.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Structured Thinking</h3>
              <p>Access built-in frameworks and templates to guide your brainstorming process.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy & Security</h3>
              <p>Control access to your sessions with public, private, and password-protected options.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Works Anywhere</h3>
              <p>Access ThinkBox from any device with a responsive design that adapts to your screen.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Export & Integration</h3>
              <p>Export your ideas in multiple formats or integrate with your existing tools.</p>
            </div>
          </div>
        </section>
        
        <section className="cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Team's Ideation Process?</h2>
            <p>Join thousands of teams already using ThinkBox to unlock their creative potential.</p>
            <Link to="/create" className="btn btn-primary btn-lg">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;