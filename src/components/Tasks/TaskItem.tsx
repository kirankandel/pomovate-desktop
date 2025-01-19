import React, { useState } from "react";

interface Task {
  id: number;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

const TaskItem: React.FC<{ task: Task; onUpdate: (updatedTask: Task) => void }> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(task.estimatedPomodoros);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (estimatedPomodoros !== task.estimatedPomodoros) {
      onUpdate({ ...task, estimatedPomodoros });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEstimatedPomodoros(Number(event.target.value));
  };

  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600">
          Estimated:{" "}
          {isEditing ? (
            <textarea
              className="w-16 border border-gray-300 rounded"
              value={estimatedPomodoros}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              title="Estimated Pomodoros"
              placeholder="Enter number"
            />
          ) : (
            <span
              className="cursor-pointer underline text-blue-600"
              onClick={handleEditToggle}
            >
              {estimatedPomodoros}
            </span>
          )}{" "}
          | Completed: {task.completedPomodoros}
        </p>
      </div>
    </li>
  );
};

export default TaskItem;
