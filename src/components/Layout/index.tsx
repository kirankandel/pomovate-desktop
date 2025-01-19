import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import Settings from '@/components/Settings';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
      <nav className="backdrop-blur-lg bg-white/30 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
            Pomovate
          </h1>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            title="Open Settings"
          >
            <SettingsIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </nav>

      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <Settings />
            </div>
          </div>
        </>
      )}

      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;