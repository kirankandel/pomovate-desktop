import React, { useState } from "react";

interface Task {
  id: number;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    const name = prompt("Enter Task Name:");
    if (name) {
      setTasks([
        ...tasks,
        { id: tasks.length + 1, name, estimatedPomodoros: 2, completedPomodoros: 0 },
      ]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center py-2 border-b last:border-none"
            >
              <div>
                <h4 className="text-lg font-semibold">{task.name}</h4>
                <p className="text-sm text-gray-500">
                  Estimated: {task.estimatedPomodoros} | Completed: {task.completedPomodoros}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No tasks added yet.</p>
      )}
      <button
        onClick={addTask}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Task
      </button>
    </div>
  );
};

export default TaskList;
