import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "./TaskCard";
import TaskHistory from "@/components/TaskHistory";
import ProjectSelect from "@/components/ProjectSelect";

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
      createdAt: new Date().toISOString(),
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
          <label className="block text-sm text-slate-600 mb-1">
            Estimated Pomodoros
          </label>
          <input
            type="number"
            min={1}
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
            className="w-full p-2 rounded-lg border border-slate-200"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Priority</label>
          <select
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
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-slate-800">Tasks</h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {showHistory ? 'Current Tasks' : 'History'}
        </button>
      </div>

      {showHistory ? (
        <TaskHistory />
      ) : (
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
      )}
    </div>
  );
};

export default TaskList;