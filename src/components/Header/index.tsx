import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">
        Start Timer
      </button>
    </header>
  );
};

export default Header;
