import React from "react";
import { useTaskContext } from "@/context/TaskContext";

const TIMER_DURATION = {
  pomodoro: 2 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

const Timer: React.FC = () => {
  const { activeTask, mode, setCurrentPomodoro, updateTaskProgress } = useTaskContext();
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(TIMER_DURATION[mode]);

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
    } else if (timeLeft === 0 && activeTask) {
      updateTaskProgress(activeTask.id);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

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