import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Email Automation Tool</h1>
        <div className="landing-cards">
          <div className="card">
            <h2>Email Generator</h2>
            <p>Generate personalized emails from your Excel data</p>
            <button className="btn-primary">Get Started</button>
          </div>
          <div className="card">
            <h2>AI Agent</h2>
            <p>Search the web for companies and contact information</p>
            <button className="btn-secondary">Coming Soon</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
