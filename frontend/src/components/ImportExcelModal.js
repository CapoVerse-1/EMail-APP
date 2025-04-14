import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImportExcelModal = ({ isOpen, onClose, onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Download template function
  const downloadTemplate = () => {
    // Create sample data in CSV format
    const csvContent = 
      "Company Name,Email,Company Description\n" +
      "Example Company,contact@example.com,A software development company focused on AI solutions.\n" +
      "Demo Corporation,info@democorp.com,Leading provider of cloud infrastructure services.";
      
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'email_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setError('');
    }
  };

  // Validate file format (only .xlsx, .xls, or .csv)
  const validateFile = (file) => {
    if (!file) return false;
    
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an Excel or CSV file (.xlsx, .xls, .csv)');
      return false;
    }
    
    return true;
  };

  // Handle file import
  const handleImport = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call for parsing Excel/CSV
    setTimeout(() => {
      // Mock successful import
      const mockData = [
        {
          'Company Name': 'Acme Corporation',
          'Email': 'contact@acmecorp.com',
          'Company Description': 'A global leader in innovative technology solutions for enterprise businesses.'
        },
        {
          'Company Name': 'TechVision Inc.',
          'Email': 'hello@techvision.io',
          'Company Description': 'Specializes in AI-powered analytics and business intelligence platforms.'
        }
      ];
      
      onImport(mockData);
      setIsLoading(false);
      setFile(null);
    }, 1500);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="bg-white rounded-xl shadow-lg w-full max-w-lg relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-800">Import Companies from Excel</h3>
                <button 
                  className="text-neutral-400 hover:text-neutral-500 focus:outline-none"
                  onClick={onClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                {/* Template Download */}
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600 mb-2">
                        Download our template to see the required format for importing company data.
                      </p>
                      <button 
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none flex items-center"
                        onClick={downloadTemplate}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'
                  } transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  
                  {file ? (
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-neutral-800 mb-1">{file.name}</p>
                      <p className="text-sm text-neutral-500 mb-4">{Math.round(file.size / 1024)} KB</p>
                      <button
                        className="text-sm text-neutral-500 hover:text-neutral-700"
                        onClick={() => {
                          setFile(null);
                          fileInputRef.current.value = '';
                        }}
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-neutral-100 text-neutral-400 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-neutral-600 mb-2">
                        <span className="font-medium">Drag and drop</span> your Excel file here, or{' '}
                        <button
                          className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
                          onClick={() => fileInputRef.current.click()}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-neutral-500">
                        Supports: .xlsx, .xls, .csv
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="mt-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-neutral-200 flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex items-center space-x-2"
                  onClick={handleImport}
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Importing...</span>
                    </>
                  ) : (
                    <span>Import</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportExcelModal; 