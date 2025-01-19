import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TrashIcon, CheckIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import Task from '@/types/task';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { 
    activeTask, 
    currentPomodoro, 
    setActiveTask, 
    deleteTask, 
    completeTask 
  } = useTaskContext();
  
  const isActive = activeTask?.id === task.id;
  const progressPercent = isActive 
    ? (currentPomodoro.elapsed / currentPomodoro.total) * 100 
    : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      setActiveTask(null);
    }
    deleteTask(task.id);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      setActiveTask(null);
    }
    completeTask(task.id);
  };

  const handleStartStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTask(isActive ? null : task);
  };

  return (
    <div
      className={`transform transition-all duration-200 
                ${isActive ? 'scale-[1.02] ring-2 ring-violet-500' : ''}
                hover:scale-[1.01] rounded-lg p-4 shadow-sm hover:shadow-md`}
      style={{
        background: isActive 
          ? `linear-gradient(to right, rgba(34, 197, 94, ${progressPercent / 100 * 0.2}), rgba(255, 255, 255, 0.5))`
          : 'rgba(255, 255, 255, 0.5)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-800">{task.description}</h4>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <span className="text-base">🍅</span>
              <span>{task.completedPomodoros}/{task.estimatedPomodoros}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'}`}>
              {task.priority}
            </span>
            {task.project && (
              <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">
                {task.project}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleComplete}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg 
                     transition-colors duration-200"
            title="Complete Task"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg 
                     transition-colors duration-200"
            title="Delete Task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleStartStop}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1
                      ${isActive ? 
                      'bg-violet-100 text-violet-700' : 
                      'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600'}`}
          >
            {isActive ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
            <span>{isActive ? 'Active' : 'Start'}</span>
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;