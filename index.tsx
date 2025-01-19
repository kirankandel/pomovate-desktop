import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  const TOTAL_TIME = 25 * 60;
  const YELLOW_THRESHOLD = TOTAL_TIME * 0.5;
  const RED_THRESHOLD = TOTAL_TIME * 0.25;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getColor = () => {
    if (timeLeft <= RED_THRESHOLD) return "border-red-500";
    if (timeLeft <= YELLOW_THRESHOLD) return "border-yellow-500";
    return "border-green-500";
  };

  const getProgress = () => {
    return (timeLeft / TOTAL_TIME) * 360;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center w-96">
      <div 
        className={`relative w-64 h-64 mx-auto mb-4 rounded-full border-8 ${getColor()}`}
        style={{
          background: `conic-gradient(transparent ${getProgress()}deg, #f3f4f6 0deg)`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</h3>
        </div>
      </div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className={`px-6 py-3 rounded-full shadow ${
          isRunning ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default Timer;