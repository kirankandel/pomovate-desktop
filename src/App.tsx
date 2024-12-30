import React from "react";
import Layout from "@/components/Layout";
import Timer from "@/components/Timer";
import TaskList from "@/components/Tasks/TaskList";

const App: React.FC = () => {
  return (
    <Layout>
      {/* Timer Section */}
      <section className="flex flex-col items-center space-y-6">
        <Timer />

        {/* Modes (Pomodoro, Short Break, Long Break) */}
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">Pomodoro</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300">Short Break</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300">Long Break</button>
        </div>
      </section>

      {/* Task Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        <TaskList />
      </section>
    </Layout>
  );
};

export default App;
