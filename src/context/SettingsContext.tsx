import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase } from '@/database/db';

export interface Settings {
    pomodoroTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
  }
  
const defaultSettings: Settings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  soundEnabled: true
};

const validateSettings = (settings: Partial<Settings>): Partial<Settings> => {
  const validated: Partial<Settings> = {};
  
  if ('pomodoroTime' in settings) {
    validated.pomodoroTime = Math.min(Math.max(1, settings.pomodoroTime!), 60);
  }
  if ('shortBreakTime' in settings) {
    validated.shortBreakTime = Math.min(Math.max(1, settings.shortBreakTime!), 30);
  }
  if ('longBreakTime' in settings) {
    validated.longBreakTime = Math.min(Math.max(1, settings.longBreakTime!), 60);
  }
  if ('longBreakInterval' in settings) {
    validated.longBreakInterval = Math.min(Math.max(1, settings.longBreakInterval!), 10);
  }
  if ('autoStartBreaks' in settings) {
    validated.autoStartBreaks = settings.autoStartBreaks;
  }
  if ('autoStartPomodoros' in settings) {
    validated.autoStartPomodoros = settings.autoStartPomodoros;
  }
  if ('soundEnabled' in settings) {
    validated.soundEnabled = settings.soundEnabled;
  }
  
  return validated;
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const [db, setDb] = useState<Awaited<ReturnType<typeof getDatabase>> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const database = await getDatabase();
        setDb(database);
        
        const savedSettings = await database.settings.get();
        if (Object.keys(savedSettings).length) {
          const validated = validateSettings(savedSettings);
          setSettings(curr => ({ ...curr, ...validated }));
        } else {
          await database.settings.update(defaultSettings);
        }
      } catch (error) {
        console.error('Failed to initialize settings:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!db) return;
    try {
      const validatedSettings = validateSettings(newSettings);
      const updatedSettings = { ...settings, ...validatedSettings };
      setSettings(updatedSettings);
      await db.settings.update(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    if (!db) return;
    try {
      setSettings(defaultSettings);
      await db.settings.update(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export default SettingsContext;