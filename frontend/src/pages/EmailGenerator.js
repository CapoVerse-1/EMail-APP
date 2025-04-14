import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImportExcelModal from '../components/ImportExcelModal';
import CompanyCard from '../components/CompanyCard';
import { useProjectContext } from '../context/ProjectContext';
import { generateEmail } from '../utils/openaiService';

const EmailGenerator = () => {
  const { activeProject, apiKey } = useProjectContext();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Sample companies for demonstration
  const sampleCompanies = [
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acmecorp.com',
      description: 'A global leader in innovative technology solutions for enterprise businesses.',
      generated: false,
      emailContent: ''
    },
    {
      id: 2,
      name: 'TechVision Inc.',
      email: 'hello@techvision.io',
      description: 'Specializes in AI-powered analytics and business intelligence platforms.',
      generated: false,
      emailContent: ''
    }
  ];

  const handleImportSuccess = (data) => {
    // Process the imported data
    const newCompanies = data.map((item, index) => ({
      id: Date.now() + index,
      name: item.company || item['Company Name'] || '',
      email: item.email || item['Email'] || '',
      description: item.description || item['Company Description'] || '',
      generated: false,
      emailContent: ''
    }));
    
    setCompanies([...companies, ...newCompanies]);
    setIsImportModalOpen(false);
  };

  const handleAddManually = () => {
    setCompanies([
      ...companies, 
      {
        id: Date.now(),
        name: '',
        email: '',
        description: '',
        generated: false,
        emailContent: ''
      }
    ]);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      alert('Please add your OpenAI API key in the settings page first.');
      return;
    }
    
    if (!activeProject) {
      alert('Please activate a project in the settings page first.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create a copy of the companies array to update
      const updatedCompanies = [...companies];
      
      // Generate emails for each company in sequence
      for (let i = 0; i < updatedCompanies.length; i++) {
        const company = updatedCompanies[i];
        try {
          // Generate email using the OpenAI service
          const emailContent = await generateEmail(activeProject, company);
          
          // Update the company with the generated email
          updatedCompanies[i] = {
            ...company,
            generated: true,
            emailContent
          };
          
          // Update the state after each company is processed
          setCompanies([...updatedCompanies]);
        } catch (error) {
          console.error(`Error generating email for ${company.name}:`, error);
          // If there's an error, still mark as generated but with an error message
          updatedCompanies[i] = {
            ...company,
            generated: true,
            emailContent: `Error generating email: ${error.message}`
          };
          setCompanies([...updatedCompanies]);
        }
      }
    } catch (error) {
      console.error('Error in generation process:', error);
      alert(`Error generating emails: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const handleUpdateCompany = (id, field, value) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, [field]: value } : company
    ));
  };

  const handleRegenerateEmail = async (id) => {
    if (!apiKey) {
      alert('Please add your OpenAI API key in the settings page first.');
      return;
    }
    
    if (!activeProject) {
      alert('Please activate a project in the settings page first.');
      return;
    }
    
    const company = companies.find(c => c.id === id);
    if (!company) return;
    
    // Set loading state for this specific company
    setCompanies(companies.map(c => 
      c.id === id ? { ...c, isRegenerating: true } : c
    ));
    
    try {
      // Generate a new email for this company
      const emailContent = await generateEmail(activeProject, company);
      
      // Update the company with the new email
      setCompanies(companies.map(c => 
        c.id === id ? { 
          ...c, 
          isRegenerating: false,
          emailContent
        } : c
      ));
    } catch (error) {
      console.error(`Error regenerating email for ${company.name}:`, error);
      
      // Update with error message
      setCompanies(companies.map(c => 
        c.id === id ? { 
          ...c, 
          isRegenerating: false,
          emailContent: `Error generating email: ${error.message}`
        } : c
      ));
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Email Generator</h1>
        <p className="text-neutral-500">Import company data and generate personalized emails</p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          className="btn btn-primary flex items-center space-x-2"
          onClick={() => setIsImportModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>Import Excel</span>
        </button>
        
        <button 
          className="btn btn-outline flex items-center space-x-2"
          onClick={handleAddManually}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Manually</span>
        </button>
        
        {companies.length > 0 && (
          <button 
            className="btn btn-secondary flex items-center space-x-2"
            onClick={handleGenerate}
            disabled={isGenerating || !apiKey || !activeProject}
            title={!apiKey ? 'API key required in settings' : !activeProject ? 'Activate a project in settings' : ''}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Generate All Emails</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Empty State */}
      {companies.length === 0 && (
        <motion.div 
          className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Companies Added Yet</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            Import an Excel file with company data or add companies manually to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className="btn btn-primary"
              onClick={() => setIsImportModalOpen(true)}
            >
              Import Excel
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleAddManually}
            >
              Add Manually
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Company Cards */}
      {companies.length > 0 && (
        <div className="flex flex-wrap gap-6 mt-6 px-1 bg-neutral-50 rounded-xl p-6">
          {companies.map(company => (
            <div key={company.id} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] 2xl:w-[calc(20%-19.2px)] bg-white rounded-xl">
              <CompanyCard
                company={company}
                onUpdate={(field, value) => handleUpdateCompany(company.id, field, value)}
                onRegenerate={() => handleRegenerateEmail(company.id)}
                onRemove={() => handleRemoveCompany(company.id)}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSuccess}
      />
    </div>
  );
};

export default EmailGenerator; 