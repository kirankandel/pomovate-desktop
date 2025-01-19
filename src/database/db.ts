import CompletedTask from '@/types/completedTask';
import Database from '@tauri-apps/plugin-sql';
import { Settings } from '@/context/SettingsContext';
import Task from '@/types/task';

let db: Database;

export const initDatabase = async () => {
  db = await Database.load('sqlite:pomovate.db');
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      name TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      estimated_pomodoros INTEGER NOT NULL,
      completed_pomodoros INTEGER DEFAULT 0,
      priority TEXT NOT NULL,
      project TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(project) REFERENCES projects(name)
    );

    CREATE TABLE IF NOT EXISTS completed_tasks (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      estimated_pomodoros INTEGER NOT NULL,
      completed_pomodoros INTEGER NOT NULL,
      priority TEXT NOT NULL,
      project TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT NOT NULL
    );
  `);
};

// Settings Operations
export const getSettings = async (): Promise<Settings> => {
  const rows: { key: string, value: string }[] = await db.select('SELECT * FROM settings');
  const defaultSettings: Settings = {
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: false
  };

  return rows.reduce((acc, row) => ({
    ...acc,
    [row.key]: JSON.parse(row.value)
  }), defaultSettings);
};

export const updateSettings = async (settings: Partial<Settings>) => {
  await Promise.all(
    Object.entries(settings).map(([key, value]) =>
      db.execute(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        [key, JSON.stringify(value)]
      )
    )
  );
};

// Task Operations
export const getTasks = async (): Promise<Task[]> => {
  return await db.select('SELECT * FROM tasks');
};

export const addTask = async (task: Omit<Task, 'id' | 'completedPomodoros'>) => {
  await db.execute(
    `INSERT INTO tasks (id, description, estimated_pomodoros, priority, project, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [crypto.randomUUID(), task.description, task.estimatedPomodoros, task.priority, 
     task.project, task.createdAt]
  );
};

export const completeTask = async (taskId: string) => {
  const [task] = await db.select<{ id: string, description: string, estimated_pomodoros: number, completed_pomodoros: number, priority: string, project: string, created_at: string }[]>('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (task) {
    await db.execute(
      `INSERT INTO completed_tasks 
       SELECT *, datetime('now') as completed_at FROM tasks WHERE id = ?`,
      [taskId]
    );
    await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
  }
};

// Project Operations
export const getProjects = async (): Promise<string[]> => {
  const rows = await db.select<{ name: string }[]>('SELECT name FROM projects');
  return rows.map(row => row.name);
};

export const addProject = async (name: string) => {
  await db.execute(
    'INSERT OR IGNORE INTO projects (name, created_at) VALUES (?, datetime("now"))',
    [name]
  );
};

// Completed Tasks Operations
export const getCompletedTasks = async (): Promise<CompletedTask[]> => {
  return await db.select('SELECT * FROM completed_tasks ORDER BY completed_at DESC');
};