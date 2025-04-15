import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { availableModels, availableEmailTypes } from '../utils/openaiService';

const GenerationSettings = () => {
  const { 
    selectedModel, 
    setSelectedModel, 
    selectedEmailType, 
    setSelectedEmailType 
  } = useProjectContext();

  return (
    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
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
  );
};

export default GenerationSettings; 