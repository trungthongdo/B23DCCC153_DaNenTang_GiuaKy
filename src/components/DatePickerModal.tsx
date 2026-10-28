import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { formatDate, getTodayStart, parseDate } from '../utils/dateUtils';
import { AppIcon } from './AppIcon';

interface DatePickerModalProps {
  visible: boolean;
  initialDateStr?: string;
  minDate?: Date | null;
  onConfirm: (dateStr: string) => void;
  onCancel: () => void;
}

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  initialDateStr,
  minDate,
  onConfirm,
  onCancel,
}) => {
  const today = useMemo(() => getTodayStart(), []);

  // Ngày tạm thời đang được chọn trong modal
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const parsed = parseDate(initialDateStr ?? '');
    return parsed ?? today;
  });

  // Tháng và năm đang hiển thị trên lịch
  const [viewYear, setViewYear] = useState<number>(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => selectedDate.getMonth());

  // Đồng bộ lại khi modal mở ra
  useEffect(() => {
    if (visible) {
      const parsed = parseDate(initialDateStr ?? '');
      const target = parsed ?? today;
      setSelectedDate(target);
      setViewYear(target.getFullYear());
      setViewMonth(target.getMonth());
    }
  }, [visible, initialDateStr, today]);

  // Chuyển tháng trước
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  // Chuyển tháng sau
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Chuyển năm trước
  const handlePrevYear = () => {
    setViewYear((prev) => prev - 1);
  };

  // Chuyển năm sau
  const handleNextYear = () => {
    setViewYear((prev) => prev + 1);
  };

  // Tính toán các ngày trong tháng hiện tại
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Thứ của ngày đầu tháng: 0 (Chủ nhật), 1 (Thứ 2), ..., 6 (Thứ 7)
    let firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    // Chuyển đổi để Thứ 2 là 0, ..., Chủ nhật là 6
    const emptySlots = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: Array<{
      day: number;
      date: Date;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
    }> = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const cellDate = new Date(viewYear, viewMonth, i);
      cellDate.setHours(0, 0, 0, 0);

      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = cellDate.getTime() === selectedDate.getTime();
      const isDisabled = minDate ? cellDate.getTime() < minDate.getTime() : false;

      days.push({
        day: i,
        date: cellDate,
        isToday,
        isSelected,
        isDisabled,
      });
    }

    return { emptySlots, days };
  }, [viewYear, viewMonth, today, selectedDate, minDate]);

  const handleSelectDay = (cellDate: Date, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }
    setSelectedDate(cellDate);
  };

  const handleConfirm = () => {
    onConfirm(formatDate(selectedDate));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.modalContent}>
          {/* Header chọn tháng/năm */}
          <View style={styles.header}>
            <View style={styles.navRow}>
              <Pressable
                onPress={handlePrevYear}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
                hitSlop={8}
                accessibilityLabel="Năm trước"
              >
                <AppIcon name="chevron-double-left" size={16} color={colors.primary} />
              </Pressable>

              <Pressable
                onPress={handlePrevMonth}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
                hitSlop={8}
                accessibilityLabel="Tháng trước"
              >
                <AppIcon name="chevron-left" size={16} color={colors.primary} />
              </Pressable>

              <View style={styles.monthYearTitleContainer}>
                <Text style={styles.monthYearTitle}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>
              </View>

              <Pressable
                onPress={handleNextMonth}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
                hitSlop={8}
                accessibilityLabel="Tháng sau"
              >
                <AppIcon name="chevron-right" size={16} color={colors.primary} />
              </Pressable>

              <Pressable
                onPress={handleNextYear}
                style={({ pressed }) => [styles.navBtn, pressed && styles.btnPressed]}
                hitSlop={8}
                accessibilityLabel="Năm sau"
              >
                <AppIcon name="chevron-double-right" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          {/* Hàng tên các thứ trong tuần */}
          <View style={styles.weekHeader}>
            {WEEK_DAYS.map((w, index) => (
              <View key={w} style={styles.weekCell}>
                <Text
                  style={[
                    styles.weekText,
                    index >= 5 && styles.weekendText,
                  ]}
                >
                  {w}
                </Text>
              </View>
            ))}
          </View>

          {/* Lưới các ngày trong tháng */}
          <View style={styles.daysGrid}>
            {/* Các ô trống trước ngày mùng 1 */}
            {Array.from({ length: calendarDays.emptySlots }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}

            {/* Các ngày trong tháng */}
            {calendarDays.days.map((item) => {
              return (
                <Pressable
                  key={`day-${item.day}`}
                  onPress={() => handleSelectDay(item.date, item.isDisabled)}
                  disabled={item.isDisabled}
                  style={({ pressed }) => [
                    styles.dayCell,
                    item.isSelected && styles.dayCellSelected,
                    item.isToday && !item.isSelected && styles.dayCellToday,
                    pressed && !item.isDisabled && styles.dayCellPressed,
                    item.isDisabled && styles.dayCellDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Ngày ${item.day} tháng ${viewMonth + 1} năm ${viewYear}`}
                >
                  <Text
                    style={[
                      styles.dayText,
                      item.isSelected && styles.dayTextSelected,
                      item.isToday && !item.isSelected && styles.dayTextToday,
                      item.isDisabled && styles.dayTextDisabled,
                    ]}
                  >
                    {item.day}
                  </Text>
                  {item.isToday && !item.isSelected && (
                    <View style={styles.todayDot} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Hiển thị ngày đang chọn */}
          <View style={styles.selectedPreview}>
            <Text style={styles.selectedPreviewLabel}>Ngày đã chọn: </Text>
            <Text style={styles.selectedPreviewValue}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          {/* Các nút hành động Huỷ / Xác nhận */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelBtnText}>Huỷ</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [styles.confirmBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.confirmBtnText}>Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    marginBottom: 12,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
    lineHeight: 22,
  },
  navBtnDoubleText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
    lineHeight: 18,
  },
  btnPressed: {
    opacity: 0.7,
  },
  monthYearTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  monthYearTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  weekHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  weekendText: {
    color: colors.danger,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 2,
    position: 'relative',
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayCellPressed: {
    opacity: 0.7,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: colors.surface,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: colors.disabledText,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 4,
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  selectedPreviewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedPreviewValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
});
