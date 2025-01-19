import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import Task from "@/types/task";
import ProjectSelect from "@/components/ProjectSelect";

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { activeTask, currentPomodoro, setActiveTask } = useTaskContext();
  const isActive = activeTask?.id === task.id;
  
  const progressPercent = isActive 
    ? (currentPomodoro.elapsed / currentPomodoro.total) * 100 
    : 0;

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
        <button
          onClick={() => setActiveTask(task)}
          className={`px-4 py-2 rounded-lg transition-colors
                    ${isActive ? 
                    'bg-violet-100 text-violet-700' : 
                    'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600'}`}
        >
          {isActive ? 'Active' : 'Start'}
        </button>
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

const AddTaskForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addTask } = useTaskContext();
  const [description, setDescription] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [project, setProject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      description,
      estimatedPomodoros,
      priority,
      project,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/50 rounded-lg p-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What are you working on?"
        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        rows={3}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Estimated Pomodoros</label>
          <input
            type="number"
            min={1}
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-slate-200"
            title="Estimated Pomodoros"
          />
        </div>
        <div>
          <label htmlFor="priority-select" className="block text-sm text-slate-600 mb-1">Priority</label>
          <select
            id="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="w-full p-2 rounded-lg border border-slate-200"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <ProjectSelect
        value={project}
        onChange={setProject}
      />
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 
                   text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext();
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-xl p-6 shadow-xl">
      <h3 className="text-2xl font-semibold text-slate-800 mb-6">Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {!isFormVisible ? (
          <div 
            onClick={() => setIsFormVisible(true)}
            className="border-2 border-dashed border-slate-300 rounded-lg p-4 
                     cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 
                     transition-all duration-200"
          >
            <div className="text-center text-slate-500 flex items-center justify-center">
              <span className="text-xl mr-2">+</span> Add New Task
            </div>
          </div>
        ) : (
          <AddTaskForm onClose={() => setIsFormVisible(false)} />
        )}
      </div>
    </div>
  );
};

export default TaskList;