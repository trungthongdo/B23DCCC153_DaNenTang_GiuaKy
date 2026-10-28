import { TaskPriority } from '../types/task';

/**
 * Phân tích chuỗi dd/mm/yyyy thành Date object.
 * Trả về null nếu định dạng sai hoặc ngày không có thật (ví dụ 31/02/2026).
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }

  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return null;
  }

  if (year < 1900 || year > 2100) {
    return null;
  }

  // Tạo đối tượng Date và kiểm tra xem ngày có bị trượt sang tháng khác không
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  // Đặt về đầu ngày (00:00:00.000)
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Lấy đối tượng Date của ngày hôm nay vào lúc 00:00:00.000
 */
export function getTodayStart(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Định dạng Date object thành chuỗi dd/mm/yyyy
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Kiểm tra xem công việc có bị quá hạn hay không.
 * Việc chỉ bị quá hạn khi: chưa hoàn thành VÀ hạn hoàn thành trước ngày hôm nay.
 */
export function isOverdue(dueDateStr: string, isDone: boolean): boolean {
  if (isDone) {
    return false;
  }
  const due = parseDate(dueDateStr);
  if (!due) {
    return false;
  }
  const today = getTodayStart();
  return due.getTime() < today.getTime();
}

/**
 * Lấy văn bản số ngày còn lại hoặc quá hạn cho màn hình Chi tiết:
 * - "Còn X ngày"
 * - "Hạn hôm nay"
 * - "Quá hạn Y ngày" (nếu chưa hoàn thành)
 */
export function getRemainingDaysInfo(
  dueDateStr: string,
  isDone: boolean
): { text: string; isOverdueStatus: boolean } {
  const due = parseDate(dueDateStr);
  if (!due) {
    return { text: dueDateStr, isOverdueStatus: false };
  }

  const today = getTodayStart();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      text: `Còn ${diffDays} ngày`,
      isOverdueStatus: false,
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Hạn hôm nay',
      isOverdueStatus: false,
    };
  }

  const overdueDays = Math.abs(diffDays);
  if (isDone) {
    return {
      text: `Đã hoàn thành (hạn ${dueDateStr})`,
      isOverdueStatus: false,
    };
  }

  return {
    text: `Quá hạn ${overdueDays} ngày`,
    isOverdueStatus: true,
  };
}

/**
 * Trọng số mức ưu tiên: Cao (3) -> Trung bình (2) -> Thấp (1)
 */
export function getPriorityWeight(priority: TaskPriority): number {
  switch (priority) {
    case 'Cao':
      return 3;
    case 'Trung bình':
      return 2;
    case 'Thấp':
      return 1;
    default:
      return 0;
  }
}
