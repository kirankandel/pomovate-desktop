import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { format } from 'date-fns';
import CompletedTask from '@/types/completedTask';

type FilterPeriod = 'all' | 'today' | 'week' | 'month';

const TaskHistory: React.FC = () => {
  const { completedTasks = [] } = useTaskContext();
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const filteredTasks = completedTasks.filter(task => {
    if (filterPeriod === 'all') return true;
    
    const completedDate = new Date(task.completedAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filterPeriod) {
      case 'today':
        return completedDate >= today;
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return completedDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        return completedDate >= monthAgo;
      default:
        return true;
    }
  }).sort((a, b) => {
    const dateA = new Date(a.completedAt).getTime();
    const dateB = new Date(b.completedAt).getTime();
    return sortDesc ? dateB - dateA : dateA - dateB;
  });

  const tasksByProject = filteredTasks.reduce((acc, task) => {
    const project = task.project || 'No Project';
    if (!acc[project]) acc[project] = [];
    acc[project].push(task);
    return acc;
  }, {} as Record<string, CompletedTask[]>);

  if (!completedTasks?.length) {
    return <div className="text-center text-slate-500 py-8">No completed tasks yet</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {(['all', 'today', 'week', 'month'] as FilterPeriod[]).map(period => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterPeriod === period
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {sortDesc ? '↓ Newest First' : '↑ Oldest First'}
        </button>
      </div>

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
                    Started: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span>
                    Completed: {format(new Date(task.completedAt), 'MMM dd, yyyy')}
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