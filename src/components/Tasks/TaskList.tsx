import React, { useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Tasks</h3>
      <div>
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 px-3 bg-gray-100 rounded mb-2 shadow"
          >
            <span>{task}</span>
            <button
              onClick={() => removeTask(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Add a new task"
          />
          <button
            onClick={addTask}
            className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
