import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 flex flex-col">
      <div className="py-6 px-4 text-center">
        <h1 className="text-2xl font-bold">Pomodoro</h1>
      </div>
      <nav className="flex-grow px-4">
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Tasks
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
