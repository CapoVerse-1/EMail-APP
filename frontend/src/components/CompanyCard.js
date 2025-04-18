import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectContext } from '../context/ProjectContext';
import { sendEmail, saveSentEmail } from '../utils/gmailService';
import { updateGeneratedEmail } from '../utils/supabaseService';

const CompanyCard = ({ company, onUpdate, onRegenerate, onRemove, emailType = 'introduction', model = 'gpt-3.5-turbo' }) => {
  const { gmailApiKey } = useProjectContext();
  const [isEditing, setIsEditing] = useState(!company.name); // Auto edit mode for new empty companies
  const [isContentEditing, setIsContentEditing] = useState(false); // New state for content editing mode
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get the most recent generated email
  const latestEmail = company.generated_emails && company.generated_emails.length > 0
    ? company.generated_emails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;
    
  const [subject, setSubject] = useState(latestEmail?.subject || `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} from Your Company`);
  // For content editing
  const [editableContent, setEditableContent] = useState(latestEmail?.content || '');
  
  // Save content changes
  const saveContentChanges = () => {
    if (latestEmail && editableContent !== latestEmail.content) {
      // Update the content in the latest email using updateGeneratedEmail
      updateGeneratedEmail(latestEmail.id, { content: editableContent })
        .then(updatedEmail => {
          // Just update the local state - don't call onUpdate with 'generated_emails'
          const updatedEmails = company.generated_emails.map(email => 
            email.id === latestEmail.id ? { ...email, content: editableContent } : email
          );
          
          // Update the company's emails in local state only
          onUpdate('_localEmailsUpdate', updatedEmails);
        })
        .catch(error => {
          console.error('Error updating email content:', error);
        });
    }
    setIsContentEditing(false);
  };
  
  const handleSend = async () => {
    if (!latestEmail || !company.email) {
      setErrorMessage('Email content or recipient email is missing');
      return;
    }
    
    setIsSending(true);
    setErrorMessage('');
    
    try {
      // Use the edited content if we're in edit mode
      const contentToSend = isContentEditing ? editableContent : latestEmail.content;
      
      // Send email via Gmail API through backend
      const response = await sendEmail(null, company.email, subject, contentToSend);
      
      if (response && response.success) {
        // Save to sent emails history in Supabase
        try {
          await saveSentEmail({
            to: company.email,
            subject: subject,
            content: contentToSend,
            company: company.name
          });
        } catch (saveError) {
          console.warn('Email sent but failed to save to history:', saveError);
        }
        
        setIsSent(true);
      } else {
        throw new Error('Failed to send email: Unknown error');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage(error.message || 'Failed to send email');
      setIsSent(false);
    } finally {
      setIsSending(false);
    }
  };
  
  // Format email type for display
  const formatEmailType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <motion.div 
      className={`overflow-hidden rounded-xl border border-neutral-200 shadow-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Card Header with Company Info */}
      <div className="p-3 bg-white">
        <div className="flex justify-between mb-2">
          <h3 className="text-base font-semibold text-neutral-800 truncate">
            {isEditing ? (
              <input
                type="text"
                className="input text-base border-neutral-200 w-full"
                placeholder="Company Name"
                value={company.name}
                onChange={(e) => onUpdate('name', e.target.value)}
              />
            ) : (
              <span>{company.name || 'Untitled Company'}</span>
            )}
          </h3>
          
          <div className="flex space-x-1">
            {!isEditing && latestEmail && (
              <button 
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full transition-colors"
                onClick={() => {
                  if (isContentEditing) {
                    // Save changes when clicking the check mark
                    if (latestEmail && editableContent !== latestEmail.content) {
                      // Update the email directly using updateGeneratedEmail
                      updateGeneratedEmail(latestEmail.id, { content: editableContent })
                        .then(updatedEmail => {
                          // Just update the local state - don't call onUpdate with 'generated_emails'
                          // as that tries to update the company record
                          const updatedEmails = company.generated_emails.map(email => 
                            email.id === latestEmail.id ? { ...email, content: editableContent } : email
                          );
                          
                          // Update the company's emails in local state only
                          onUpdate('_localEmailsUpdate', updatedEmails);
                        })
                        .catch(error => {
                          console.error('Error updating email content:', error);
                        });
                    }
                    setIsContentEditing(false);
                  } else {
                    setIsContentEditing(true);
                    setEditableContent(latestEmail.content);
                  }
                }}
                title={isContentEditing ? "Save changes" : "Edit email content"}
              >
                {isContentEditing ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
              </button>
            )}
            
            {!isEditing && (
              <button 
                className="p-1 text-red-400 hover:text-red-600 rounded-full transition-colors"
                onClick={onRemove}
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-2 mb-2">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
              <input
                type="email"
                className="input border-neutral-200 focus:ring-1"
                placeholder="contact@company.com"
                value={company.email}
                onChange={(e) => onUpdate('email', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Description</label>
              <textarea
                className="input min-h-[80px] border-neutral-200 focus:ring-1"
                placeholder="Describe what the company does"
                value={company.description}
                onChange={(e) => onUpdate('description', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Save Details
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-2">
            {company.email && (
              <div className="flex items-center text-xs text-neutral-600 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {company.email}
              </div>
            )}
            
            {company.description && (
              <p className="text-xs text-neutral-600 line-clamp-2 overflow-hidden">
                {company.description}
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Email Content Area */}
      {!isEditing && (
        <div className="p-3 bg-neutral-50 border-t border-neutral-200">
          {latestEmail ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-neutral-700">Generated Email</h4>
                <div className="flex space-x-2">
                  {isContentEditing && (
                    <button 
                      className="text-xs flex items-center text-primary-600 hover:text-primary-800"
                      onClick={saveContentChanges}
                    >
                      Save changes
                    </button>
                  )}
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
              
              <div className="flex items-center mb-2">
                <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-2">
                  {formatEmailType(latestEmail.email_type || emailType)}
                </div>
                <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {(latestEmail.model || model).startsWith('gpt-') ? (latestEmail.model || model).substring(4).toUpperCase() : (latestEmail.model || model)}
                </div>
              </div>

              {/* Email Subject */}
              {!isSent && (
                <div className="mb-2">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Subject Line</label>
                  <input
                    type="text"
                    className="input text-xs"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              )}
              
              <div className={`bg-white border ${isContentEditing ? 'border-primary-300 ring-2 ring-primary-100' : 'border-neutral-200'} rounded-lg p-2 mb-2 transition-all duration-200`}>
                <textarea
                  className="w-full min-h-[120px] outline-none text-xs text-neutral-700 resize-none overflow-auto"
                  value={isContentEditing ? editableContent : latestEmail.content}
                  onChange={isContentEditing ? (e) => setEditableContent(e.target.value) : undefined}
                  readOnly={!isContentEditing}
                />
              </div>
              
              {errorMessage && (
                <div className="text-red-500 text-xs mb-2">
                  {errorMessage}
                </div>
              )}
              
              <div className="flex justify-end">
                {isSent ? (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sent Successfully
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm flex items-center space-x-1"
                    onClick={handleSend}
                    disabled={isSending || !company.email}
                    title={!company.email ? 'Recipient email required' : ''}
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
              <p className="text-neutral-500 text-sm mb-3">No email has been generated yet.</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={onRegenerate}
                disabled={company.isRegenerating || !company.description}
              >
                {company.isRegenerating ? 'Generating...' : 'Generate Email'}
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CompanyCard; 