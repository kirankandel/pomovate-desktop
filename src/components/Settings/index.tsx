import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import type { Settings } from '@/context/SettingsContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleNumberChange = (key: keyof Settings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateSettings({ [key]: numValue });
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-xl p-6 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Timer Settings</h2>
      
      <div className="space-y-6">
        {/* Timer Durations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pomodoro Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.pomodoroTime}
              onChange={(e) => handleNumberChange('pomodoroTime', e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              title="Pomodoro Duration"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              placeholder="Enter Short Break Duration"
              value={settings.shortBreakTime}
              onChange={(e) => handleNumberChange('shortBreakTime', e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="Enter Long Break Duration"
              value={settings.longBreakTime}
              max="60"
              onChange={(e) => handleNumberChange('longBreakTime', e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Long Break Interval (pomodoros)
            </label>
            <input
              placeholder="Enter Long Break Interval"
              value={settings.longBreakInterval}
              min="1"
              max="10"
              onChange={(e) => handleNumberChange('longBreakInterval', e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Autostart Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Auto-start Breaks</span>
            <button
              title="Toggle Auto-start Breaks"
              onClick={() => updateSettings({ autoStartBreaks: !settings.autoStartBreaks })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.autoStartBreaks ? 'bg-violet-500' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Auto-start Pomodoros</span>
            <button
              title="Toggle Auto-start Pomodoros"
              onClick={() => updateSettings({ autoStartPomodoros: !settings.autoStartPomodoros })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.autoStartPomodoros ? 'bg-violet-500' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Sound Notifications</span>
            <button
              title="Toggle Sound Notifications"
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.soundEnabled ? 'bg-violet-500' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              const defaultSettings = {
                pomodoroTime: 25,
                shortBreakTime: 5,
                longBreakTime: 15,
                longBreakInterval: 4,
                autoStartBreaks: true,
                autoStartPomodoros: true,
                soundEnabled: true
              };
              updateSettings(defaultSettings);
            }}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;