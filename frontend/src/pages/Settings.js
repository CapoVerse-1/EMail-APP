import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import GenerationSettings from '../components/GenerationSettings';

const Settings = () => {
  const { 
    apiKey, 
    gmailApiKey,
    updateApiKey, 
    updateGmailApiKey
  } = useProjectContext();
  
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempGmailApiKey, setTempGmailApiKey] = useState(gmailApiKey);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGmailKey, setShowGmailKey] = useState(false);

  const handleSaveSettings = () => {
    updateApiKey(tempApiKey);
    updateGmailApiKey(tempGmailApiKey);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your API keys and generation settings</p>
      </div>

      {/* Container to push settings to the right */}
      <div className="flex justify-end">
        {/* General Settings Section - Now aligned right */}
        <div className="w-full max-w-4xl"> {/* Adjust max-width as needed */} 
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">General Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: API Keys etc */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  API Key for OpenAI
                </label>
                <div className="relative">
                  <input
                    type={showOpenAIKey ? "text" : "password"}
                    className="input pr-10"
                    placeholder="sk-..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-neutral-500 hover:text-neutral-700"
                    onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  >
                    {showOpenAIKey ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Your API key is stored securely and used for email generation.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  API Key for SendGrid
                </label>
                <div className="relative">
                  <input
                    type={showGmailKey ? "text" : "password"}
                    className="input pr-10"
                    placeholder="Enter your SendGrid API key..."
                    value={tempGmailApiKey}
                    onChange={(e) => setTempGmailApiKey(e.target.value)}
                  />
                   <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-neutral-500 hover:text-neutral-700"
                    onClick={() => setShowGmailKey(!showGmailKey)}
                  >
                    {showGmailKey ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Your SendGrid API key is used to send emails. Ensure it has Mail Send permissions.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Language
                </label>
                <select className="input">
                  <option>English</option>
                  <option>German</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Signature
                </label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Your email signature..."
                  defaultValue="Best regards,&#10;Your Name&#10;Your Position | Your Company&#10;Phone: +1 234 567 890"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* Right Column: Generation Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <GenerationSettings />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;