export default interface Task {
    id: string;
    description: string;
    createdAt: string;
    completedPomodoros: number;
    estimatedPomodoros: number;
    priority: 'high' | 'medium' | 'low';
    project?: string;
  }