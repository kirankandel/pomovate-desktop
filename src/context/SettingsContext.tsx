import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
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

const STORAGE_KEY = 'pomodoroSettings';

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
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = validateSettings(parsed);
        return { ...defaultSettings, ...validated };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const validatedSettings = validateSettings(newSettings);
    setSettings(prev => ({ ...prev, ...validatedSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

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