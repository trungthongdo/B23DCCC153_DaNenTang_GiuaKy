import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateInitialTasks, loadTasks, saveTasks } from '../src/storage/taskStorage';
import { Task } from '../src/types/task';
import { isOverdue } from '../src/utils/dateUtils';

describe('taskStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generateInitialTasks creates at least 6 tasks with at least 1 done and 1 overdue', () => {
    const initialTasks = generateInitialTasks();
    expect(initialTasks.length).toBeGreaterThanOrEqual(6);

    const hasDone = initialTasks.some((t) => t.done === true);
    expect(hasDone).toBe(true);

    const hasOverdue = initialTasks.some((t) => isOverdue(t.dueDate, t.done));
    expect(hasOverdue).toBe(true);
  });

  test('loadTasks returns initial tasks and stores them when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const tasks = await loadTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(6);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  test('loadTasks returns existing stored tasks without overwriting', async () => {
    const existing: Task[] = [
      {
        id: 't1',
        title: 'Công việc thử nghiệm',
        category: 'Công việc',
        priority: 'Cao',
        dueDate: '30/10/2026',
        done: false,
      },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existing));

    const tasks = await loadTasks();
    expect(tasks).toEqual(existing);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('saveTasks persists tasks to AsyncStorage', async () => {
    const tasks: Task[] = [
      {
        id: 't2',
        title: 'Làm bài thi',
        category: 'Học tập',
        priority: 'Cao',
        dueDate: '28/10/2026',
        done: true,
      },
    ];

    const result = await saveTasks(tasks);
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(tasks)
    );
  });
});
