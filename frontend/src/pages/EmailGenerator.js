import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImportExcelModal from '../components/ImportExcelModal';
import CompanyCard from '../components/CompanyCard';
import { useProjectContext } from '../context/ProjectContext';
import { generateEmail, availableModels, availableEmailTypes } from '../utils/openaiService';
import { 
  fetchCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  createGeneratedEmail
} from '../utils/supabaseService';

const EmailGenerator = () => {
  const { activeProject, apiKey } = useProjectContext();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [selectedEmailType, setSelectedEmailType] = useState('introduction');
  
  // Load companies when activeProject changes
  useEffect(() => {
    const loadCompanies = async () => {
      if (!activeProject) return;
      
      setIsLoading(true);
      try {
        const companiesData = await fetchCompanies(activeProject.id);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanies();
  }, [activeProject]);

  const handleImportSuccess = async (data) => {
    if (!activeProject) return;
    
    try {
      // Process the imported data
      const newCompaniesPromises = data.map(async (item) => {
        // Handle different possible column names from Excel
        const companyName = item['Company Name'] || item['company'] || item['Company'] || item['company name'] || item['Name'] || '';
        const email = item['Email'] || item['email'] || item['Company Email'] || item['company email'] || '';
        const description = item['Company Description'] || item['description'] || item['company description'] || item['Description'] || '';
        
        const newCompany = {
          project_id: activeProject.id,
          name: companyName,
          email: email,
          description: description,
        };
        
        // Only create companies that have at least a name
        if (newCompany.name) {
          return await createCompany(newCompany);
        }
        return null;
      });
      
      const newCompanies = (await Promise.all(newCompaniesPromises)).filter(company => company !== null);
      
      if (newCompanies.length === 0) {
        alert('No valid companies found in the import. Please check your file format.');
      } else {
        setCompanies([...companies, ...newCompanies]);
        console.log(`Successfully imported ${newCompanies.length} companies`);
      }
      
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Error importing companies:', error);
      alert(`Error importing companies: ${error.message}`);
    }
  };

  const handleAddManually = async () => {
    if (!activeProject) return;
    
    try {
      const newCompany = await createCompany({
        project_id: activeProject.id,
        name: '',
        email: '',
        description: ''
      });
      
      setCompanies([...companies, newCompany]);
    } catch (error) {
      console.error('Error adding company:', error);
    }
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
      // Generate emails for each company in sequence
      for (let company of companies) {
        if (company.generated_emails && company.generated_emails.length > 0) {
          continue; // Skip if already has generated emails
        }
        
        try {
          // Generate email using the OpenAI service with selected options
          const emailContent = await generateEmail(activeProject, company, {
            emailType: selectedEmailType,
            model: selectedModel
          });
          
          // Save generated email to Supabase
          const generatedEmail = await createGeneratedEmail({
            company_id: company.id,
            content: emailContent,
            email_type: selectedEmailType,
            model: selectedModel,
            subject: `${selectedEmailType.charAt(0).toUpperCase() + selectedEmailType.slice(1)} from Your Company`
          });
          
          // Update local state
          setCompanies(prev => 
            prev.map(c => 
              c.id === company.id 
                ? { 
                    ...c, 
                    generated_emails: [...(c.generated_emails || []), generatedEmail] 
                  } 
                : c
            )
          );
        } catch (error) {
          console.error(`Error generating email for ${company.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in generation process:', error);
      alert(`Error generating emails: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveCompany = async (id) => {
    try {
      await deleteCompany(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error removing company:', error);
    }
  };

  const handleUpdateCompany = async (id, field, value) => {
    try {
      // Special case for updating emails locally only, don't send to backend
      if (field === '_localEmailsUpdate') {
        setCompanies(companies.map(company => 
          company.id === id ? { ...company, generated_emails: value } : company
        ));
        return;
      }

      // Normal case: update the company record
      await updateCompany(id, { [field]: value });
      setCompanies(companies.map(company => 
        company.id === id ? { ...company, [field]: value } : company
      ));
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleRegenerateEmail = async (companyId) => {
    if (!apiKey) {
      alert('Please add your OpenAI API key in the settings page first.');
      return;
    }
    
    if (!activeProject) {
      alert('Please activate a project in the settings page first.');
      return;
    }
    
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    
    // Set loading state for this specific company
    setCompanies(companies.map(c => 
      c.id === companyId ? { ...c, isRegenerating: true } : c
    ));
    
    try {
      // Generate a new email for this company with selected options
      const emailContent = await generateEmail(activeProject, company, {
        emailType: selectedEmailType,
        model: selectedModel
      });
      
      // Save regenerated email to Supabase
      const generatedEmail = await createGeneratedEmail({
        company_id: company.id,
        content: emailContent,
        email_type: selectedEmailType,
        model: selectedModel,
        is_regenerated: true,
        subject: `${selectedEmailType.charAt(0).toUpperCase() + selectedEmailType.slice(1)} from Your Company`
      });
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === companyId 
          ? { 
              ...c, 
              isRegenerating: false,
              generated_emails: [...(c.generated_emails || []), generatedEmail]
            } 
          : c
      ));
    } catch (error) {
      console.error(`Error regenerating email for ${company.name}:`, error);
      
      // Update with error message
      setCompanies(companies.map(c => 
        c.id === companyId 
          ? { 
              ...c, 
              isRegenerating: false
            } 
          : c
      ));
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Email Generator</h1>
        <p className="text-neutral-500">Import company data and generate personalized emails</p>
      </div>
      
      {/* Settings Section */}
      <div className="mb-6 p-3 bg-neutral-50 rounded-lg border border-neutral-200 max-w-md">
        <h2 className="text-md font-semibold text-neutral-700 mb-3">Generation Settings</h2>
        
        <div className="space-y-3">
          {/* Email Type Selection */}
          <div>
            <label htmlFor="emailType" className="block text-xs font-medium text-neutral-600 mb-1">
              Email Type
            </label>
            <select
              id="emailType"
              className="w-full p-1.5 text-sm border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedEmailType}
              onChange={(e) => setSelectedEmailType(e.target.value)}
            >
              {availableEmailTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Model Selection */}
          <div>
            <label htmlFor="model" className="block text-xs font-medium text-neutral-600 mb-1">
              AI Model
            </label>
            <select
              id="model"
              className="w-full p-1.5 text-sm border border-neutral-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button 
          className="btn btn-primary flex items-center space-x-2"
          onClick={() => setIsImportModalOpen(true)}
          disabled={!activeProject}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>Import Excel</span>
        </button>
        
        <button 
          className="btn btn-outline flex items-center space-x-2"
          onClick={handleAddManually}
          disabled={!activeProject}
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
      
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mt-4">Loading companies...</h3>
        </div>
      ) : companies.length === 0 ? (
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
              disabled={!activeProject}
            >
              Import Excel
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleAddManually}
              disabled={!activeProject}
            >
              Add Manually
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-wrap gap-6 mt-6 px-1 bg-neutral-50 rounded-xl p-6">
          {companies.map(company => (
            <div key={company.id} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] 2xl:w-[calc(20%-19.2px)] bg-white rounded-xl">
              <CompanyCard
                company={company}
                onUpdate={(field, value) => handleUpdateCompany(company.id, field, value)}
                onRegenerate={() => handleRegenerateEmail(company.id)}
                onRemove={() => handleRemoveCompany(company.id)}
                emailType={selectedEmailType}
                model={selectedModel}
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