import React, { createContext, useContext, useState, useEffect } from 'react';
import Task from '@/types/task';
import CompletedTask from '@/types/completedTask';
import { 
  getDatabase,
  tasks as dbTasks,
  projects as dbProjects,
  completedTasks as dbCompletedTasks
} from '@/database/db';

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
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string, partialProgress: number) => Promise<void>;
  setMode: (mode: TimerMode) => void;
  addProject: (project: string) => Promise<void>;
  setActiveTask: (task: Task | null) => void;
  addTask: (task: Omit<Task, 'id' | 'completedPomodoros'>) => Promise<void>;
  updateTaskProgress: (taskId: string) => Promise<void>;
  setCurrentPomodoro: (pomodoro: { elapsed: number; total: number }) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [currentPomodoro, setCurrentPomodoro] = useState({ elapsed: 0, total: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await getDatabase();
        const [loadedTasks, loadedCompletedTasks, loadedProjects] = await Promise.all([
          dbTasks.getAll(),
          dbCompletedTasks.getAll(),
          dbProjects.getAll()
        ]);
        setTasks(loadedTasks);
        setCompletedTasks(loadedCompletedTasks);
        setProjects(loadedProjects);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize tasks:', error);
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'completedPomodoros'>) => {
    try {
      await dbTasks.add(taskData);
      const updatedTasks = await dbTasks.getAll();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (activeTask?.id === id) {
        setActiveTask(null);
      }
      await dbTasks.delete(id);
      const updatedTasks = await dbTasks.getAll();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const completeTask = async (id: string, partialProgress?: number) => {
    try {
      if (activeTask?.id === id) {
        setActiveTask(null);
      }
      
      const task = tasks.find(t => t.id === id);
      if (task) {
        const finalCompletedPomodoros = task.completedPomodoros + (partialProgress || 0);
        await dbTasks.complete(id, finalCompletedPomodoros);
        
        const [updatedTasks, updatedCompletedTasks] = await Promise.all([
          dbTasks.getAll(),
          dbCompletedTasks.getAll()
        ]);
        setTasks(updatedTasks);
        setCompletedTasks(updatedCompletedTasks);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  };

  const updateTaskProgress = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedTask = {
          ...task,
          completedPomodoros: task.completedPomodoros + 1
        };
        await dbTasks.update(updatedTask);
        const updatedTasks = await dbTasks.getAll();
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Failed to update task progress:', error);
      throw error;
    }
  };

  const addProject = async (project: string) => {
    try {
      await dbProjects.add(project);
      const updatedProjects = await dbProjects.getAll();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <TaskContext.Provider value={{
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
    }}>
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