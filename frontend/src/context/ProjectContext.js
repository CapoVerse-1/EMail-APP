import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ProjectContext = createContext();

// Custom hook to use the project context
export const useProjectContext = () => useContext(ProjectContext);

// Provider component
export const ProjectProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call to fetch projects
        // In a real app, this would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock projects data
        const mockProjects = [
          {
            id: 1,
            name: 'Default Project',
            description: 'Your default email generation project',
            settings: {
              businessDescription: 'We are a software company specializing in AI-powered automation tools for businesses. Our solutions help streamline workflows and increase productivity.',
              emailTemplate: 'Dear [Company],\n\nI came across your website and was impressed by your work in [Industry]. I believe our services could greatly benefit your operations.\n\nWould you be available for a quick call next week?\n\nBest regards,\nYour Name',
              greeting: 'Hello,',
              outro: 'Looking forward to hearing from you.',
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        
        setProjects(mockProjects);
        
        // Set the active project to the one marked as active
        const active = mockProjects.find(p => p.isActive);
        setActiveProject(active || null);
        
        // Load API key from localStorage
        const savedApiKey = localStorage.getItem('openai_api_key') || '';
        setApiKey(savedApiKey);
        
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Handle project activation/deactivation
  const toggleProjectActive = (id) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => ({
        ...project,
        isActive: project.id === id
      }));
      
      // Set the active project
      const newActiveProject = updatedProjects.find(p => p.id === id) || null;
      setActiveProject(newActiveProject);
      
      return updatedProjects;
    });
  };

  // Update API key
  const updateApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('openai_api_key', newKey);
  };

  // Add a new project
  const addProject = (newProject) => {
    setProjects(prevProjects => [
      ...prevProjects,
      {
        ...newProject,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: false,
      }
    ]);
  };

  // Update a project
  const updateProject = (updatedProject) => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(project => 
        project.id === updatedProject.id 
          ? { ...updatedProject, updatedAt: new Date().toISOString() } 
          : project
      );
      
      // If the updated project is active, update the activeProject state
      if (updatedProject.isActive) {
        setActiveProject(updatedProject);
      }
      
      return updated;
    });
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects,
        activeProject,
        apiKey,
        isLoading,
        toggleProjectActive,
        updateApiKey,
        addProject,
        updateProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext; 