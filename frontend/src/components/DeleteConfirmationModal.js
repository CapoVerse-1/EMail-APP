import React from 'react';
import { motion } from 'framer-motion';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-neutral-800">Delete {itemName}</h3>
            <button 
              className="text-neutral-400 hover:text-neutral-500"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <p className="text-neutral-700">Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.</p>
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
            className="btn bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal; 