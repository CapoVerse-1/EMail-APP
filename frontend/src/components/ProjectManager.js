import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import CreateProjectModal from './CreateProjectModal'; // Assuming modal is in the same directory
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Assuming modal is in the same directory

const ProjectManager = () => {
  const { 
    projects, 
    activeProject, 
    toggleProjectActive,
    addProject,
    deleteProject
  } = useProjectContext();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, projectId: null });

  const handleActivateProject = (id) => {
    toggleProjectActive(id);
  };

  const handleCreateProject = (newProject) => {
    addProject(newProject);
    setIsCreateModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ isOpen: true, projectId: id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.projectId) {
      await deleteProject(deleteConfirmation.projectId);
    }
    setDeleteConfirmation({ isOpen: false, projectId: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, projectId: null });
  };

  return (
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
              {project.is_active ? (
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
              {new Date(project.updated_at || project.updatedAt).toLocaleDateString()}
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
                {project.is_active ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                className="btn btn-outline py-1 px-2 text-xs text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteClick(project.id)}
                title="Delete Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreate={handleCreateProject} 
        />
      )}
      {deleteConfirmation.isOpen && (
        <DeleteConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          itemName={projects.find(p => p.id === deleteConfirmation.projectId)?.name || 'Project'}
        />
      )}
    </div>
  );
};

export default ProjectManager; 