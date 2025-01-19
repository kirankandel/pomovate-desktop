import React, { createContext, useContext, useState } from 'react';
import Task from '@/types/task';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';
export interface CompletedTask extends Task {
  completedAt: string;
}
interface TaskContextType {
  completedTasks: CompletedTask[];
  tasks: Task[];
  activeTask: Task | null;
  projects: string[];
  mode: TimerMode;
  currentPomodoro: {
    elapsed: number;
    total: number;
  };
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  setMode: (mode: TimerMode) => void;
  addProject: (project: string) => void;
  setActiveTask: (task: Task | null) => void;
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros'>) => void;
  updateTaskProgress: (taskId: string) => void;
  setCurrentPomodoro: (pomodoro: { elapsed: number; total: number }) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [currentPomodoro, setCurrentPomodoro] = useState({ elapsed: 0, total: 25 * 60 });
  const [projects, setProjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const completedTask: CompletedTask = {
        ...task,
        completedAt: new Date().toISOString()
      };
      setCompletedTasks([...completedTasks, completedTask]);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };
  const addProject = (project: string) => {
    if (!projects.includes(project)) {
      const newProjects = [...projects, project];
      setProjects(newProjects);
      localStorage.setItem('projects', JSON.stringify(newProjects));
    }
  };
  const addTask = (taskData: Omit<Task, 'id' | 'completedPomodoros'>) => {
    const newTask = {
      ...taskData,
      id: crypto.randomUUID(),
      completedPomodoros: 0
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskProgress = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
        : task
    ));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      completedTasks,
      activeTask,
      projects,
      addProject,
      mode,
      currentPomodoro,
      setMode,
      setActiveTask,
      addTask,
      updateTaskProgress,
      setCurrentPomodoro,
      deleteTask,
      completeTask,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within TaskProvider');
  return context;
};