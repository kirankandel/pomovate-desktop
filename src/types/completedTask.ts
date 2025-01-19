import Task from './task';

export default interface CompletedTask extends Task {
    completedAt: string;
  }