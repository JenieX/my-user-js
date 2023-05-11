import { Task, TasksOptions } from './types';
import { startLogger, finishLogger } from './logger';

async function tasksRunner<T>(task: Task, options: TasksOptions): Promise<T> {
  startLogger(task.name);

  const startTimestamp = Date.now();
  const result = await task(options) as T;
  const endTimestamp = Date.now();

  finishLogger(task.name, endTimestamp - startTimestamp);

  return result;
}

export default tasksRunner;
