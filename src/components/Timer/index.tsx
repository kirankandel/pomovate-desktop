import React from "react";
import { useTaskContext } from "@/context/TaskContext";
import { useSettings } from "@/context/SettingsContext";

const Timer: React.FC = () => {
  const { settings } = useSettings();
  const { activeTask, mode, setMode, setCurrentPomodoro, updateTaskProgress } = useTaskContext();
  const [isRunning, setIsRunning] = React.useState(false);
  const [cycles, setCycles] = React.useState(0);
  
  const TIMER_DURATION = {
    pomodoro: settings.pomodoroTime * 60,
    shortBreak: settings.shortBreakTime * 60,
    longBreak: settings.longBreakTime * 60
  };

  const [timeLeft, setTimeLeft] = React.useState(TIMER_DURATION[mode]);

  const handleCycleCompletion = () => {
    if (mode === 'pomodoro' && activeTask) {
      updateTaskProgress(activeTask.id);
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      // Determine next break type
      if (newCycles % settings.longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }

      // Handle auto-start for breaks
      setIsRunning(settings.autoStartBreaks);
    } else {
      setMode('pomodoro');
      // Handle auto-start for pomodoros
      setIsRunning(settings.autoStartPomodoros);
    }
  };

  React.useEffect(() => {
    setTimeLeft(TIMER_DURATION[mode]);
    setCurrentPomodoro({
      elapsed: 0,
      total: TIMER_DURATION[mode]
    });
    setIsRunning(false);
  }, [mode, settings]);
  
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        setCurrentPomodoro({
          elapsed: TIMER_DURATION[mode] - (timeLeft - 1),
          total: TIMER_DURATION[mode]
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleCycleCompletion();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getProgress = () => {
    const total = TIMER_DURATION[mode];
    return ((total - timeLeft) / total) * 360;
  };

  const getColor = () => {
    const progress = getProgress();
    if (progress > 270) return '#ef4444'; // red
    if (progress > 180) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  return (
    <div className="relative">
      <div className="backdrop-blur-lg bg-white/30 rounded-xl p-8 shadow-xl">
        <div className="relative w-64 h-64 mx-auto">
          {/* Progress Circle */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                ${getColor()} ${getProgress()}deg,
                #f3f4f6 ${getProgress()}deg
              )`,
              transition: 'all 1s linear'
            }}
          >
            <div className="absolute inset-2 bg-white rounded-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className={`text-4xl font-bold ${
                  isRunning ? 'animate-pulse' : ''
                }`}>
                  {formatTime(timeLeft)}
                </h3>
                {activeTask && (
                  <p className="text-sm text-slate-600 mt-2 max-w-[80%] truncate">
                    {activeTask.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-full transition-all
              ${isRunning ? 
                'bg-red-500 hover:bg-red-600' : 
                'bg-gradient-to-r from-violet-500 to-purple-500 hover:shadow-lg'
              } text-white font-medium shadow-lg hover:scale-105 active:scale-95`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;