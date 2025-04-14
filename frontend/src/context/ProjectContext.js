import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  fetchProjects, 
  getActiveProject, 
  setProjectActive, 
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  getApiKeys,
  updateApiKeys
} from '../utils/supabaseService';

// Create the context
const ProjectContext = createContext();

// Custom hook to use the project context
export const useProjectContext = () => useContext(ProjectContext);

// Provider component
export const ProjectProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [gmailApiKey, setGmailApiKey] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize projects on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load projects from Supabase
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        
        // Get active project
        const active = await getActiveProject();
        setActiveProject(active);
        
        // Load API keys from Supabase
        const settings = await getApiKeys();
        if (settings) {
          const openaiKey = settings.openai_api_key || '';
          setApiKey(openaiKey);
          // Make API key available globally for the openaiService
          window.apiKeyFromContext = openaiKey;
          
          setGmailApiKey(settings.gmail_api_key || '');
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle project activation/deactivation
  const toggleProjectActive = async (id) => {
    try {
      // Update in Supabase
      const updatedProject = await setProjectActive(id);
      
      // Update local state
      setProjects(prevProjects => {
        const updatedProjects = prevProjects.map(project => ({
          ...project,
          is_active: project.id === id
        }));
        return updatedProjects;
      });
      
      // Set the active project
      setActiveProject(updatedProject);
    } catch (error) {
      console.error('Error activating project:', error);
    }
  };

  // Update API key
  const updateApiKey = async (newKey) => {
    try {
      await updateApiKeys({ openai_api_key: newKey });
      setApiKey(newKey);
      // Update the global variable when API key changes
      window.apiKeyFromContext = newKey;
    } catch (error) {
      console.error('Error updating OpenAI API key:', error);
    }
  };

  // Update Gmail API key
  const updateGmailApiKey = async (newKey) => {
    try {
      await updateApiKeys({ gmail_api_key: newKey });
      setGmailApiKey(newKey);
    } catch (error) {
      console.error('Error updating Gmail API key:', error);
    }
  };

  // Add a new project
  const addProject = async (newProject) => {
    try {
      const created = await createProjectApi({
        name: newProject.name,
        description: newProject.description,
        settings: newProject.settings,
        is_active: false
      });
      
      setProjects(prevProjects => [...prevProjects, created]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Update a project
  const updateProject = async (updatedProject) => {
    try {
      const updated = await updateProjectApi(updatedProject.id, updatedProject);
      
      setProjects(prevProjects => {
        const newProjects = prevProjects.map(project => 
          project.id === updated.id ? updated : project
        );
        return newProjects;
      });
      
      // If the updated project is active, update the activeProject state
      if (updated.is_active) {
        setActiveProject(updated);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await deleteProjectApi(id);
      
      // If the deleted project was active, set activeProject to null
      if (activeProject && activeProject.id === id) {
        setActiveProject(null);
      }
      
      // Remove the project from state
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== id)
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects,
        activeProject,
        apiKey,
        gmailApiKey,
        isLoading,
        toggleProjectActive,
        updateApiKey,
        updateGmailApiKey,
        addProject,
        updateProject,
        deleteProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext; 