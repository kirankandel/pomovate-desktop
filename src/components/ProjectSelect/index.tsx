import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, onChange }) => {
  const { projects, addProject } = useTaskContext();
  const [inputValue, setInputValue] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (project: string) => {
    onChange(project);
    setInputValue(project);
    setIsDropdownOpen(false);
  };

  const handleCreate = () => {
    if (inputValue && !projects.includes(inputValue)) {
      addProject(inputValue);
      onChange(inputValue);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Project (optional)"
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
      />
      
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
          {projects
            .filter(p => p.toLowerCase().includes(inputValue.toLowerCase()))
            .map(project => (
              <div
                key={project}
                onClick={() => handleSelect(project)}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
              >
                {project}
              </div>
            ))}
          {inputValue && !projects.includes(inputValue) && (
            <div
              onClick={handleCreate}
              className="px-4 py-2 text-violet-600 hover:bg-violet-50 cursor-pointer font-medium"
            >
              + Add "{inputValue}" as new project
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectSelect;