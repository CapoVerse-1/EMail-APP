import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';

const Settings = () => {
  const { 
    projects, 
    apiKey, 
    gmailApiKey,
    toggleProjectActive,
    updateApiKey, 
    updateGmailApiKey,
    addProject 
  } = useProjectContext();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempGmailApiKey, setTempGmailApiKey] = useState(gmailApiKey);

  const handleActivateProject = (id) => {
    toggleProjectActive(id);
  };

  const handleCreateProject = (newProject) => {
    addProject(newProject);
    setIsCreateModalOpen(false);
  };

  const handleSaveSettings = () => {
    updateApiKey(tempApiKey);
    updateGmailApiKey(tempGmailApiKey);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your AI projects and email generation settings</p>
      </div>

      {/* Project List Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">AI Projects</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Project
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-neutral-200 bg-neutral-50">
            <div className="text-sm font-medium text-neutral-500">Project Name</div>
            <div className="text-sm font-medium text-neutral-500">Status</div>
            <div className="text-sm font-medium text-neutral-500">Last Updated</div>
            <div></div>
          </div>

          {projects.map(project => (
            <div 
              key={project.id}
              className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-neutral-100 items-center hover:bg-neutral-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-neutral-800">{project.name}</h3>
                <p className="text-sm text-neutral-500 truncate max-w-md">{project.description}</p>
              </div>
              
              <div>
                {project.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                    Inactive
                  </span>
                )}
              </div>
              
              <div className="text-sm text-neutral-500">
                {new Date(project.updatedAt).toLocaleDateString()}
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  to={`/project-settings/${project.id}`}
                  className="btn btn-outline py-1 px-3 text-xs"
                >
                  Edit
                </Link>
                
                <button
                  className="btn btn-primary py-1 px-3 text-xs"
                  onClick={() => handleActivateProject(project.id)}
                >
                  {project.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings Section */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">General Settings</h2>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                API Key for OpenAI
              </label>
              <input
                type="password"
                className="input"
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <p className="mt-1 text-xs text-neutral-500">
                Your API key is stored securely and used for email generation.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                API Key for Gmail
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter your Gmail API key..."
                value={tempGmailApiKey}
                onChange={(e) => setTempGmailApiKey(e.target.value)}
              />
              <p className="mt-1 text-xs text-neutral-500">
                Your Gmail API key is used to send emails directly from the application.
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
            
            <div className="flex justify-end">
              <button 
                className="btn btn-primary"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

// Create Project Modal Component
const CreateProjectModal = ({ onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(33); // Set to first step by default
  
  const steps = [
    {
      title: 'Basic Information',
      fields: ['projectName', 'description']
    },
    {
      title: 'Business Description',
      fields: ['businessDescription']
    },
    {
      title: 'Email Templates',
      fields: ['emailTemplate', 'greeting', 'outro']
    }
  ];
  
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    businessDescription: '',
    emailTemplate: '',
    greeting: 'Hello,',
    outro: 'Looking forward to hearing from you.',
  });
  
  // Remove auto-calculation of progress based on filled fields
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Update progress when moving to next step
      setProgress(Math.round(((currentStep + 2) / steps.length) * 100));
    } else {
      // Submit form
      onCreate({
        name: formData.projectName,
        description: formData.description,
        settings: {
          businessDescription: formData.businessDescription,
          emailTemplate: formData.emailTemplate,
          greeting: formData.greeting,
          outro: formData.outro
        }
      });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Update progress when moving back
      setProgress(Math.round(((currentStep) / steps.length) * 100));
    }
  };
  
  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => formData[field]?.trim() !== '');
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-xl shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-neutral-800">Create AI Project</h3>
            <button 
              className="text-neutral-400 hover:text-neutral-500"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Step Indicator */}
          <div className="flex justify-between mt-2 text-sm text-neutral-500">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep].title}</span>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Project Name*
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Sales Outreach Campaign"
                  value={formData.projectName}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description*
                </label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="What is this project for?"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Your Business Description*
                </label>
                <textarea
                  className="input min-h-[200px]"
                  placeholder="Describe your business in detail. This helps the AI understand what you do and generate more relevant emails."
                  value={formData.businessDescription}
                  onChange={(e) => handleChange('businessDescription', e.target.value)}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Include your value proposition, target audience, and unique selling points.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Template Example (Optional)
                </label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="Paste an example email you've written before to help the AI understand your style."
                  value={formData.emailTemplate}
                  onChange={(e) => handleChange('emailTemplate', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Greeting*
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Hello, Hi there, Dear [Company] team"
                  value={formData.greeting}
                  onChange={(e) => handleChange('greeting', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Default Outro*
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Best regards, Looking forward to your response"
                  value={formData.outro}
                  onChange={(e) => handleChange('outro', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="p-6 border-t border-neutral-200 flex justify-between">
          <button
            className="btn btn-outline"
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === steps.length - 1 ? 'Create Project' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 