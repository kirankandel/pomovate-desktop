import React, { createContext, useContext, useState, useEffect } from 'react';
import Task from '@/types/task';
import CompletedTask from '@/types/completedTask';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

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
  completeTask: (id: string, partialProgress: number) => void;
  setMode: (mode: TimerMode) => void;
  addProject: (project: string) => void;
  setActiveTask: (task: Task | null) => void;
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros'>) => void;
  updateTaskProgress: (taskId: string) => void;
  setCurrentPomodoro: (pomodoro: { elapsed: number; total: number }) => void;
}

const STORAGE_KEY = 'task_context_data';

const loadFromStorage = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data: Partial<TaskContextType>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to local storage:', error);
  }
};

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedData = loadFromStorage();
  const [tasks, setTasks] = useState<Task[]>(storedData?.tasks || []);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(storedData?.completedTasks || []);
  const [projects, setProjects] = useState<string[]>(storedData?.projects || []);
  const [activeTask, setActiveTask] = useState<Task | null>(storedData?.activeTask || null);
  const [mode, setMode] = useState<TimerMode>(storedData?.mode || 'pomodoro');
  const [currentPomodoro, setCurrentPomodoro] = useState(storedData?.currentPomodoro || { elapsed: 0, total: 0 });

  useEffect(() => {
    const dataToSave = {
      tasks,
      completedTasks,
      projects,
      activeTask,
      mode,
      currentPomodoro,
    };
    saveToStorage(dataToSave);
  }, [tasks, completedTasks, projects, activeTask, mode, currentPomodoro]);

  const addTask = (taskData: Omit<Task, 'id' | 'completedPomodoros'>) => {
    const newTask: Task = {
      id: String(Date.now()), // Generate a unique ID
      ...taskData,
      completedPomodoros: 0,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    if (activeTask?.id === id) {
      setActiveTask(null);
    }
  };

  const completeTask = (id: string, partialProgress: number = 0) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      setCompletedTasks((prevCompleted) => [
        ...prevCompleted,
        { ...task, completedPomodoros: task.completedPomodoros + partialProgress, completedAt: new Date().toISOString() },
      ]);
      if (activeTask?.id === id) {
        setActiveTask(null);
      }
    }
  };

  const updateTaskProgress = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  };

  const addProject = (project: string) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasks,
        activeTask,
        projects,
        mode,
        currentPomodoro,
        deleteTask,
        completeTask,
        setMode,
        addProject,
        setActiveTask,
        addTask,
        updateTaskProgress,
        setCurrentPomodoro,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

export default TaskContext;
