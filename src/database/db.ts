import { getVersion } from '@tauri-apps/api/app';
import Database from '@tauri-apps/plugin-sql';
import { Settings } from '@/context/SettingsContext';
import Task from '@/types/task';
import CompletedTask from '@/types/completedTask';
interface IDatabase {
  settings: {
    get(): Promise<Settings>;
    update(settings: Partial<Settings>): Promise<void>;
  };
  tasks: {
    getAll(): Promise<Task[]>;
    add(task: Omit<Task, 'id' | 'completedPomodoros'>): Promise<void>;
    update(task: Task): Promise<void>;
    delete(id: string): Promise<void>;
    complete(id: string): Promise<void>;
  };
  projects: {
    getAll(): Promise<string[]>;
    add(name: string): Promise<void>;
  };
  completedTasks: {
    getAll(): Promise<CompletedTask[]>;
  };
}

class WebStorageDatabase implements IDatabase {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  private setStorageItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  settings = {
    get: async (): Promise<Settings> => {
      return this.getStorageItem('settings', {
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        longBreakInterval: 4,
        soundEnabled: true,
        autoStartBreaks: false,
        autoStartPomodoros: false
      });
    },
    update: async (settings: Partial<Settings>): Promise<void> => {
      const current = await this.settings.get();
      this.setStorageItem('settings', { ...current, ...settings });
    }
  };

  tasks = {
    getAll: async (): Promise<Task[]> => {
      return this.getStorageItem('tasks', []);
    },
    add: async (task: Omit<Task, 'id' | 'completedPomodoros'>): Promise<void> => {
      const tasks = await this.tasks.getAll();
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        completedPomodoros: 0
      };
      this.setStorageItem('tasks', [...tasks, newTask]);
    },
    update: async (task: Task): Promise<void> => {
      const tasks = await this.tasks.getAll();
      const updated = tasks.map(t => t.id === task.id ? task : t);
      this.setStorageItem('tasks', updated);
    },
    delete: async (id: string): Promise<void> => {
      const tasks = await this.tasks.getAll();
      this.setStorageItem('tasks', tasks.filter(t => t.id !== id));
    },
    complete: async (id: string): Promise<void> => {
      const tasks = await this.tasks.getAll();
      const task = tasks.find(t => t.id === id);
      if (task) {
        const completedTasks = await this.completedTasks.getAll();
        const completedTask: CompletedTask = {
          ...task,
          completedAt: new Date().toISOString()
        };
        this.setStorageItem('completedTasks', [...completedTasks, completedTask]);
        await this.tasks.delete(id);
      }
    }
  };

  projects = {
    getAll: async (): Promise<string[]> => {
      return this.getStorageItem('projects', []);
    },
    add: async (name: string): Promise<void> => {
      const projects = await this.projects.getAll();
      if (!projects.includes(name)) {
        this.setStorageItem('projects', [...projects, name]);
      }
    }
  };

  completedTasks = {
    getAll: async (): Promise<CompletedTask[]> => {
      return this.getStorageItem('completedTasks', []);
    }
  };
}

class TauriDatabase implements IDatabase {
  private db: Database | null = null;

  private async init() {
    if (!this.db) {
      this.db = await Database.load('sqlite:pomovate.db');
      await this.createTables();
    }
    return this.db;
  }

  private async createTables() {
    await this.db?.execute(`
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
  }

  settings = {
    get: async (): Promise<Settings> => {
      const db = await this.init();
      const rows = await db.select<{ key: string, value: string }[]>('SELECT * FROM settings');
      return rows.reduce((acc, { key, value }) => ({
        ...acc,
        [key]: JSON.parse(value)
      }), {} as Settings);
    },
    update: async (settings: Partial<Settings>): Promise<void> => {
      const db = await this.init();
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          db.execute(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            [key, JSON.stringify(value)]
          )
        )
      );
    }
  };

  tasks = {
    getAll: async (): Promise<Task[]> => {
      const db = await this.init();
      return db.select('SELECT * FROM tasks');
    },
    add: async (task: Omit<Task, 'id' | 'completedPomodoros'>): Promise<void> => {
      const db = await this.init();
      await db.execute(
        `INSERT INTO tasks (id, description, estimated_pomodoros, priority, project, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), task.description, task.estimatedPomodoros,
         task.priority, task.project, task.createdAt]
      );
    },
    update: async (task: Task): Promise<void> => {
      const db = await this.init();
      await db.execute(
        `UPDATE tasks 
         SET description = ?, estimated_pomodoros = ?, completed_pomodoros = ?,
             priority = ?, project = ?
         WHERE id = ?`,
        [task.description, task.estimatedPomodoros, task.completedPomodoros,
         task.priority, task.project, task.id]
      );
    },
    delete: async (id: string): Promise<void> => {
      const db = await this.init();
      await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    },
    complete: async (id: string): Promise<void> => {
      const db = await this.init();
      await db.execute(
        `INSERT INTO completed_tasks 
         SELECT *, datetime('now') as completed_at 
         FROM tasks WHERE id = ?`,
        [id]
      );
      await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    }
  };

  projects = {
    getAll: async (): Promise<string[]> => {
      const db = await this.init();
      const rows = await db.select<{ name: string }[]>('SELECT name FROM projects');
      return rows.map(row => row.name);
    },
    add: async (name: string): Promise<void> => {
      const db = await this.init();
      await db.execute(
        'INSERT OR IGNORE INTO projects (name, created_at) VALUES (?, datetime("now"))',
        [name]
      );
    }
  };

  completedTasks = {
    getAll: async (): Promise<CompletedTask[]> => {
      const db = await this.init();
      return db.select('SELECT * FROM completed_tasks ORDER BY completed_at DESC');
    }
  };
}

const isRunningInTauri = async () => {
  try {
    await getVersion();
    return true;
  } catch {
    return false;
  }
};

let databaseInstance: IDatabase | null = null;

export const getDatabase = async () => {
  if (!databaseInstance) {
    const isTauri = await isRunningInTauri();
    databaseInstance = isTauri ? new TauriDatabase() : new WebStorageDatabase();
  }
  return databaseInstance;
};

export const { settings, tasks, projects, completedTasks } = await getDatabase();