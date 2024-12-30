import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center w-96">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">{formatTime(timeLeft)}</h3>
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
