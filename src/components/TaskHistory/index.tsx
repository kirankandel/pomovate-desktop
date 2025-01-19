import React from 'react';
import { useTaskContext } from '@/context/TaskContext';

const TaskHistory: React.FC = () => {
  const { completedTasks } = useTaskContext();

  const tasksByProject = completedTasks.reduce((acc, task) => {
    const project = task.project || 'No Project';
    if (!acc[project]) {
      acc[project] = [];
    }
    acc[project].push(task);
    return acc;
  }, {} as Record<string, CompletedTask[]>);

  return (
    <div className="space-y-6">
      {Object.entries(tasksByProject).map(([project, tasks]) => (
        <div key={project}>
          <h3 className="text-lg font-medium text-slate-800 mb-3">{project}</h3>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="bg-white/50 rounded-lg p-4">
                <h4 className="font-medium">{task.description}</h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                  <span>🍅 {task.completedPomodoros}</span>
                  <span>
                    Completed: {new Date(task.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskHistory;