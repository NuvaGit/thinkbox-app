import React from 'react';
import SessionWorkspace from '../components/session/SessionWorkspace';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Session = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <SessionWorkspace />
      </main>
      <Footer />
    </div>
  );
};

export default Session;