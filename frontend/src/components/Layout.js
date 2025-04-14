import React from 'react';

/**
 * Layout component that provides the base structure for the application
 * Wraps all pages with consistent styling and structure
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default Layout; 