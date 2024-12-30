import React from "react";

interface Task {
  id: number;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600">
          Estimated: {task.estimatedPomodoros} | Completed: {task.completedPomodoros}
        </p>
      </div>
    </li>
  );
};

export default TaskItem;