import React from "react";
import Layout from "@/components/Layout";
import Timer from "@/components/Timer";
import TaskList from "@/components/Tasks/TaskList";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";

const AppContent: React.FC = () => {
  const { mode, setMode } = useTaskContext();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="flex flex-col items-center space-y-8">
            <div className="backdrop-blur-lg bg-white/30 rounded-full p-1.5 flex space-x-1">
              <button 
                onClick={() => setMode('pomodoro')}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  mode === 'pomodoro' 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                Pomodoro
              </button>
              {/* ... other mode buttons ... */}
            </div>
            <Timer />
          </section>
          <section className="flex flex-col space-y-6">
            <TaskList />
          </section>
        </div>
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;