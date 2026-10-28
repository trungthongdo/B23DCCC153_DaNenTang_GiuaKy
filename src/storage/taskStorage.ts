import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { formatDate, getTodayStart } from '../utils/dateUtils';

const STORAGE_KEY = '@PlannerApp_tasks_v1';

/**
 * Tạo dữ liệu mẫu lần đầu chạy (ít nhất 6 công việc, có ít nhất 1 đã hoàn thành và 1 quá hạn).
 */
export function generateInitialTasks(): Task[] {
  const today = getTodayStart();

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 3);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 3);

  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 7);

  return [
    {
      id: 'task_sample_1',
      title: 'Lập trình ứng dụng React Native CLI',
      note: 'Hoàn thành các màn hình và kiểm tra validation form theo đúng đề thi.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: formatDate(tomorrow),
      done: false,
    },
    {
      id: 'task_sample_2',
      title: 'Nộp báo cáo giữa kỳ môn Đa nền tảng',
      note: 'Nộp file nén HoTen_MSSV_De3.zip lên hệ thống quản lý học tập.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: formatDate(pastDate), // Việc quá hạn
      done: false,
    },
    {
      id: 'task_sample_3',
      title: 'Họp nhóm đồ án tốt nghiệp trực tuyến',
      note: 'Thảo luận với các thành viên về kiến trúc hệ thống và phân công công việc.',
      category: 'Công việc',
      priority: 'Trung bình',
      dueDate: formatDate(today),
      done: false,
    },
    {
      id: 'task_sample_4',
      title: 'Chạy bộ 5km công viên Cầu Giấy',
      note: 'Rèn luyện sức bền và theo dõi nhịp tim sau buổi học.',
      category: 'Sức khoẻ',
      priority: 'Thấp',
      dueDate: formatDate(yesterday),
      done: true, // Việc đã hoàn thành
    },
    {
      id: 'task_sample_5',
      title: 'Đọc tài liệu TypeScript nâng cao',
      note: 'Nghiên cứu về Generics và Utility Types để áp dụng vào dự án.',
      category: 'Cá nhân',
      priority: 'Trung bình',
      dueDate: formatDate(futureDate1),
      done: false,
    },
    {
      id: 'task_sample_6',
      title: 'Khám sức khoẻ định kỳ tại bệnh viện',
      note: 'Kiểm tra mắt và sức khoẻ tổng quát định kỳ.',
      category: 'Sức khoẻ',
      priority: 'Cao',
      dueDate: formatDate(futureDate2),
      done: false,
    },
  ];
}

/**
 * Tải danh sách công việc từ AsyncStorage.
 * Nếu là lần đầu chạy (chưa có key trong storage), khởi tạo 6 công việc mẫu và lưu lại.
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (rawData !== null) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // Lần đầu mở ứng dụng: khởi tạo dữ liệu mẫu và lưu vào storage
    const initialTasks = generateInitialTasks();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ AsyncStorage:', error);
    return generateInitialTasks();
  }
}

/**
 * Lưu danh sách công việc vào AsyncStorage.
 */
export async function saveTasks(tasks: Task[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu vào AsyncStorage:', error);
    return false;
  }
}
