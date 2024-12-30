import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid"; // Heroicons v2 import
import Button from "@/components/Button"; // Import the new Button component

interface Task {
  id: number;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Learn React", estimatedPomodoros: 3, completedPomodoros: 1 },
    { id: 2, name: "Write Blog Post", estimatedPomodoros: 2, completedPomodoros: 0 },
  ]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [tempTaskName, setTempTaskName] = useState("");

  const handleEdit = (id: number, name: string) => {
    setEditingTaskId(id);
    setTempTaskName(name);
  };

  const saveEdit = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, name: tempTaskName } : task
      )
    );
    setEditingTaskId(null);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addTask = () => {
    const name = prompt("Enter Task Name:");
    if (name) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          name,
          estimatedPomodoros: 1,
          completedPomodoros: 0,
        },
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
              {/* Editable Task Name */}
              <div className="flex items-center space-x-2">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={tempTaskName}
                    onChange={(e) => setTempTaskName(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Edit task name"
                  />
                ) : (
                  <span className="text-lg font-semibold">{task.name}</span>
                )}
                {editingTaskId === task.id ? (
                  <Button
                    type="primary"
                    onClick={() => saveEdit(task.id)}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="secondary"
                    onClick={() => handleEdit(task.id, task.name)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Task Info */}
              <div className="text-sm text-gray-500">
                Estimated: {task.estimatedPomodoros} | Completed:{" "}
                {task.completedPomodoros}
              </div>

              {/* Delete Button */}
              <Button type="danger" onClick={() => deleteTask(task.id)}>
                <TrashIcon className="h-5 w-5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No tasks added yet.</p>
      )}
      {/* Add Task Button */}
      <Button type="primary" onClick={addTask} className="mt-4 w-full">
        + Add Task
      </Button>
    </div>
  );
};

export default TaskList;
