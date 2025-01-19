import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings as updateDbSettings, initDatabase } from '@/database/db';

export interface Settings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

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

const defaultSettings: Settings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  soundEnabled: true
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

  // Initialize database and load settings
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        const savedSettings = await getSettings();
        if (Object.keys(savedSettings).length) {
          const validated = validateSettings(savedSettings);
          setSettings(curr => ({ ...curr, ...validated }));
        } else {
          // If no settings in DB, save defaults
          await updateDbSettings(defaultSettings);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize settings:', error);
      }
    };
    init();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const validatedSettings = validateSettings(newSettings);
      const updatedSettings = { ...settings, ...validatedSettings };
      setSettings(updatedSettings);
      await updateDbSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await updateDbSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null; // or loading indicator
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