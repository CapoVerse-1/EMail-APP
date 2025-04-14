import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import EmailGenerator from './pages/EmailGenerator';
import Settings from './pages/Settings';
import ProjectSettings from './pages/ProjectSettings';
import SentEmails from './pages/SentEmails';

// Components
import Navbar from './components/Navbar';

function App() {
  // Get the base URL from the environment or default to '/'
  const basename = process.env.PUBLIC_URL || '';

  return (
    <Router basename={basename}>
      <div className="App">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/email-generator" element={<EmailGenerator />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/project-settings/:id" element={<ProjectSettings />} />
            <Route path="/sent-emails" element={<SentEmails />} />
            {/* Add a catch-all route to handle 404s */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
