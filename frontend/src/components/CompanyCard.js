import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CompanyCard = ({ company, onUpdate, onRegenerate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(!company.name); // Auto edit mode for new empty companies
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleSend = () => {
    if (!company.emailContent) return;
    
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };
  
  return (
    <motion.div 
      className={`card shadow-md overflow-hidden ${isEditing ? 'border-2 border-primary-300' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Card Header with Company Info */}
      <div className="p-4 bg-white">
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-semibold text-neutral-800 truncate">
            {isEditing ? (
              <input
                type="text"
                className="input text-lg"
                placeholder="Company Name"
                value={company.name}
                onChange={(e) => onUpdate('name', e.target.value)}
              />
            ) : (
              <span>{company.name || 'Untitled Company'}</span>
            )}
          </h3>
          
          <div className="flex space-x-1">
            {!isEditing && (
              <button 
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full transition-colors"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            <button 
              className="p-1 text-red-400 hover:text-red-600 rounded-full transition-colors"
              onClick={onRemove}
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="contact@company.com"
                value={company.email}
                onChange={(e) => onUpdate('email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Description</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="Describe what the company does"
                value={company.description}
                onChange={(e) => onUpdate('description', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(false)}
              >
                Save Details
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            {company.email && (
              <div className="flex items-center text-sm text-neutral-600 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {company.email}
              </div>
            )}
            
            {company.description && (
              <p className="text-sm text-neutral-600 line-clamp-2 overflow-hidden">
                {company.description}
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Email Content Area */}
      {!isEditing && (
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
          {company.generated ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-neutral-700">Generated Email</h4>
                <div className="flex space-x-2">
                  <button 
                    className="text-xs flex items-center text-neutral-500 hover:text-neutral-700"
                    onClick={onRegenerate}
                    disabled={company.isRegenerating}
                  >
                    {company.isRegenerating ? (
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    Regenerate
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-neutral-200 rounded-lg p-3 mb-3">
                <textarea
                  className="w-full min-h-[150px] outline-none text-sm text-neutral-700 resize-none overflow-auto"
                  value={company.emailContent}
                  onChange={(e) => onUpdate('emailContent', e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                {isSent ? (
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sent Successfully
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary flex items-center space-x-1"
                    onClick={handleSend}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-neutral-100 text-neutral-400 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-700 mb-1">No Email Generated Yet</h3>
              <p className="text-xs text-neutral-500 mb-3">
                Click "Generate All Emails" to create personalized content.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CompanyCard; 