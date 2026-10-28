import {
  formatDate,
  getPriorityWeight,
  getRemainingDaysInfo,
  getTodayStart,
  isOverdue,
  parseDate,
} from '../src/utils/dateUtils';

describe('dateUtils', () => {
  test('parseDate parses valid dates correctly', () => {
    const d = parseDate('28/10/2026');
    expect(d).not.toBeNull();
    expect(d?.getDate()).toBe(28);
    expect(d?.getMonth()).toBe(9); // 0-indexed: 9 is October
    expect(d?.getFullYear()).toBe(2026);
  });

  test('parseDate rejects non-existent dates like 31/02/2026', () => {
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate('29/02/2025')).toBeNull(); // 2025 is not a leap year
    expect(parseDate('32/01/2026')).toBeNull();
    expect(parseDate('15/13/2026')).toBeNull();
    expect(parseDate('abc')).toBeNull();
    expect(parseDate('2026-10-28')).toBeNull(); // wrong format
  });

  test('isOverdue correctly detects overdue tasks', () => {
    const today = getTodayStart();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterdayStr = formatDate(yesterday);
    const tomorrowStr = formatDate(tomorrow);
    const todayStr = formatDate(today);

    // If done is true, never overdue
    expect(isOverdue(yesterdayStr, true)).toBe(false);

    // If done is false, past date is overdue
    expect(isOverdue(yesterdayStr, false)).toBe(true);

    // Today is not overdue
    expect(isOverdue(todayStr, false)).toBe(false);

    // Tomorrow is not overdue
    expect(isOverdue(tomorrowStr, false)).toBe(false);
  });

  test('getRemainingDaysInfo returns correct text for all scenarios', () => {
    const today = getTodayStart();

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 3);

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 2);

    expect(getRemainingDaysInfo(formatDate(futureDate), false).text).toBe('Còn 3 ngày');
    expect(getRemainingDaysInfo(formatDate(today), false).text).toBe('Hạn hôm nay');
    expect(getRemainingDaysInfo(formatDate(pastDate), false).text).toBe('Quá hạn 2 ngày');
    expect(getRemainingDaysInfo(formatDate(pastDate), false).isOverdueStatus).toBe(true);
  });

  test('getPriorityWeight ranks Cao > Trung bình > Thấp', () => {
    expect(getPriorityWeight('Cao')).toBeGreaterThan(getPriorityWeight('Trung bình'));
    expect(getPriorityWeight('Trung bình')).toBeGreaterThan(getPriorityWeight('Thấp'));
  });
});
