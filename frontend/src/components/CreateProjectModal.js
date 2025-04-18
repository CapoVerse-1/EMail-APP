import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Create Project Modal Component Extracted
const CreateProjectModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    businessDescription: '',
    emailTemplate: '',
    greeting: 'Hello,',
    outro: 'Looking forward to hearing from you.',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(33); // Start at first step progress
  
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
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
      setProgress(Math.round(((currentStep) / steps.length) * 100));
    }
  };
  
  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    // Only require fields marked with * implicitly (projectName, description, businessDescription, greeting, outro)
    // Check if it's the first step and basic info is filled
    if (currentStep === 0) {
      return formData.projectName?.trim() !== '' && formData.description?.trim() !== '';
    }
    // Check if it's the second step and business description is filled
    if (currentStep === 1) {
      return formData.businessDescription?.trim() !== '';
    }
     // Check if it's the third step and required fields are filled
    if (currentStep === 2) {
      return formData.greeting?.trim() !== '' && formData.outro?.trim() !== '';
    }
    return false; // Should not happen
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

export default CreateProjectModal; 