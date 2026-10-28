export type TaskCategory = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  title: string;
  note?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // Định dạng dd/mm/yyyy
  done: boolean;
}

export type FilterStatus = 'Tất cả' | 'Chưa xong' | 'Đã xong' | 'Quá hạn';

export type SortOption = 'dueDate' | 'priority';

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task };
  TaskDetail: { taskId: string };
};
