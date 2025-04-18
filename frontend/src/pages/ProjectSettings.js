import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../utils/supabaseService';

const ProjectSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch project settings
  useEffect(() => {
    const fetchProjectSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get real project data from Supabase
        const projectData = await getProjectById(id);
        
        // Make sure settings is an object even if it's null in the database
        if (!projectData.settings) {
          projectData.settings = {
            businessDescription: '',
            emailTemplate: '',
            greeting: 'Hello,',
            outro: 'Looking forward to hearing from you.',
          };
        }
        
        setSettings(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project. Please try again.');
        // If there's an error, navigate back to settings after a short delay
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProjectSettings();
    }
  }, [id, navigate]);

  const handleChange = (field, value) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSettingsChange = (field, value) => {
    if (!settings || !settings.settings) return;
    
    setSettings({
      ...settings,
      settings: {
        ...settings.settings,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    
    try {
      // Save to Supabase
      await updateProject(settings.id, {
        name: settings.name,
        description: settings.description,
        settings: settings.settings
      });
      
      // Navigate back to settings page
      navigate('/settings');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 flex justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">{error}</h3>
          <p className="text-neutral-500">Redirecting to settings page...</p>
        </div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="py-8 flex justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">Project not found</h3>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => navigate('/settings')}
          >
            Return to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <button 
            className="mr-3 text-neutral-500 hover:text-neutral-700"
            onClick={() => navigate('/settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-neutral-800">Edit Project</h1>
        </div>
        <p className="text-neutral-500 mt-2">Customize settings for this specific email project</p>
      </div>

      {/* Project Form */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800">Project Details</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                className="input"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                className="input min-h-[80px]"
                value={settings.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>
          
          {/* AI Prompting Settings */}
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <h3 className="text-lg font-medium text-neutral-800 mb-3">AI Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Your Business Description
              </label>
              <textarea
                className="input min-h-[150px]"
                value={settings.settings.businessDescription}
                onChange={(e) => handleSettingsChange('businessDescription', e.target.value)}
                placeholder="Describe your business in detail. This helps the AI understand what you do and generate more relevant emails."
              />
              <p className="mt-1 text-xs text-neutral-500">
                This description will be used by the AI to understand your business and craft personalized emails.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Template Example
              </label>
              <textarea
                className="input min-h-[150px]"
                value={settings.settings.emailTemplate}
                onChange={(e) => handleSettingsChange('emailTemplate', e.target.value)}
                placeholder="Paste an example email you've written before to help the AI understand your style."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Greeting
                </label>
                <input
                  type="text"
                  className="input"
                  value={settings.settings.greeting}
                  onChange={(e) => handleSettingsChange('greeting', e.target.value)}
                  placeholder="e.g., Hello, Hi there, Dear [Company] team"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Outro
                </label>
                <input
                  type="text"
                  className="input"
                  value={settings.settings.outro}
                  onChange={(e) => handleSettingsChange('outro', e.target.value)}
                  placeholder="e.g., Best regards, Looking forward to your response"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="p-6 border-t border-neutral-200 flex justify-end space-x-3">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/settings')}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex items-center space-x-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings; 