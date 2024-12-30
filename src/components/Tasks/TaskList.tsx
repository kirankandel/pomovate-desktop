import React, { useState } from "react";
import TaskItem from "@/components/Tasks/TaskItem";

interface Task {
  id: number;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Learn React", estimatedPomodoros: 4, completedPomodoros: 2 },
    { id: 2, name: "Write Blog Post", estimatedPomodoros: 3, completedPomodoros: 1 },
  ]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
