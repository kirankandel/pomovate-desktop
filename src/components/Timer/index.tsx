import React, { useEffect, useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { useSettings } from "@/context/SettingsContext";
import { formatTime } from "@/utils/formatTime";

const Timer: React.FC = () => {
  const { settings } = useSettings();
  const {
    activeTask,
    mode,
    setMode,
    setCurrentPomodoro,
    updateTaskProgress,
    completeTask
  } = useTaskContext();

  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const TIMER_DURATION = {
    pomodoro: settings.pomodoroTime * 60,
    shortBreak: settings.shortBreakTime * 60,
    longBreak: settings.longBreakTime * 60
  };

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION[mode]);

  const getProgress = () => ((TIMER_DURATION[mode] - timeLeft) / TIMER_DURATION[mode]) * 100;

  const getTimerColors = () => {
    switch (mode) {
      case 'pomodoro':
        return { ring: 'rgb(139 92 246)', background: 'rgb(237 233 254)' };
      case 'shortBreak':
        return { ring: 'rgb(34 197 94)', background: 'rgb(220 252 231)' };
      case 'longBreak':
        return { ring: 'rgb(59 130 246)', background: 'rgb(219 234 254)' };
    }
  };

  useEffect(() => {
    setTimeLeft(TIMER_DURATION[mode]);
    setElapsedTime(0);
    setCurrentPomodoro({
      elapsed: 0,
      total: TIMER_DURATION[mode]
    });
  }, [mode, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setElapsedTime(prev => prev + 1);
        setCurrentPomodoro({
          elapsed: elapsedTime + 1,
          total: TIMER_DURATION[mode]
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    if (mode === 'pomodoro' && activeTask) {
      await updateTaskProgress(activeTask.id);
    }

    const newCycles = mode === 'pomodoro' ? cycles + 1 : cycles;
    setCycles(newCycles);

    if (mode === 'pomodoro') {
      const nextMode = newCycles >= settings.longBreakInterval ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      setMode('pomodoro');
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
  };

  const handleCompleteTask = async () => {
    if (activeTask) {
      setIsRunning(false);
      const progress = elapsedTime / TIMER_DURATION[mode];
      await completeTask(activeTask.id, progress);
      setTimeLeft(TIMER_DURATION[mode]);
      setElapsedTime(0);
      setCurrentPomodoro({ elapsed: 0, total: TIMER_DURATION[mode] });
      setMode('pomodoro');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATION[mode]);
    setElapsedTime(0);
    setCurrentPomodoro({ elapsed: 0, total: TIMER_DURATION[mode] });
  };

  const colors = getTimerColors();
  const progress = getProgress();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <svg className="w-64 h-64 -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={colors.background}
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={colors.ring}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: '754',
                strokeDashoffset: 754 - (754 * progress) / 100,
                transition: 'stroke-dashoffset 0.5s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-slate-700">
              {formatTime(timeLeft)}
            </div>
            <div className="mt-4 space-x-4">
              <button
                onClick={toggleTimer}
                className="px-6 py-2 text-sm rounded-full bg-violet-500 text-white 
                         hover:bg-violet-600 transition-colors duration-200"
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-2 text-sm rounded-full border border-slate-300 
                         text-slate-600 hover:bg-slate-100 transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTask && mode === 'pomodoro' && (
        <div className="text-center">
          <button
            onClick={handleCompleteTask}
            className="px-6 py-2 rounded-lg bg-green-500 text-white 
                     hover:bg-green-600 transition-colors duration-200"
          >
            Complete Task
          </button>
          <div className="mt-2 text-slate-600">
            Current Task: {activeTask.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;