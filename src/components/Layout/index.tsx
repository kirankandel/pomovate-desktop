import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-red-50 text-gray-800">
      {/* Header */}
      <header className="w-full py-4 bg-red-100 text-center text-lg font-semibold">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">Pomodoro Timer</div>
          <div className="flex space-x-4">
            <button className="text-sm px-4 py-1 bg-gray-100 rounded hover:bg-gray-200">Report</button>
            <button className="text-sm px-4 py-1 bg-gray-100 rounded hover:bg-gray-200">Settings</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-100 text-center text-sm">
        © 2024 Pomovate. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
