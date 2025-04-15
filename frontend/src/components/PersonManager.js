import React from 'react';
import createPersonIcon from '../assets/create-person-icon.png'; // Import the image

const PersonManager = () => {

  // Placeholder data for circles (excluding the create button)
  const placeholderCircles = Array(9).fill(null);

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">Persons</h2>
      <div className="grid grid-cols-5 gap-6">
        {/* Create Person Button Circle */}
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="h-20 w-20 rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-50 transition-colors duration-200 overflow-hidden p-1.5">
            <img 
              src={createPersonIcon} 
              alt="Create Person" 
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-600 group-hover:text-primary-700 transition-colors duration-200">Create Person</p>
        </div>

        {/* Placeholder Person Circles */}
        {placeholderCircles.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-neutral-200"></div> 
            {/* Placeholder for name below circle if needed */}
            {/* <p className="mt-2 text-sm text-neutral-500">Person {index + 1}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonManager; 