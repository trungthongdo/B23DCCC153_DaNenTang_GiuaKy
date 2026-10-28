import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { Task, TaskPriority } from '../types/task';
import { isOverdue } from '../utils/dateUtils';
import { Checkbox } from './Checkbox';

interface TaskCardProps {
  task: Task;
  onToggleDone: (taskId: string) => void;
  onPress: (taskId: string) => void;
  onLongPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleDone,
  onPress,
  onLongPress,
}) => {
  const overdue = isOverdue(task.dueDate, task.done);

  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'Cao':
        return {
          bg: colors.dangerLight,
          textColor: colors.danger,
          borderColor: '#FCA5A5',
        };
      case 'Trung bình':
        return {
          bg: colors.warningLight,
          textColor: colors.warning,
          borderColor: '#FCD34D',
        };
      case 'Thấp':
        return {
          bg: colors.successLight,
          textColor: colors.success,
          borderColor: '#86EFAC',
        };
      default:
        return {
          bg: colors.background,
          textColor: colors.textSecondary,
          borderColor: colors.border,
        };
    }
  };

  const priorityStyle = getPriorityBadgeStyle(task.priority);

  return (
    <Pressable
      onPress={() => onPress(task.id)}
      onLongPress={() => onLongPress(task)}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardDone,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Công việc: ${task.title}`}
      accessibilityHint="Nhấn để xem chi tiết, nhấn giữ để xoá"
    >
      <View style={styles.contentRow}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={task.done}
            onPress={() => onToggleDone(task.id)}
            accessibilityLabel={`Đánh dấu hoàn thành cho ${task.title}`}
          />
        </View>

        <View style={styles.textContainer}>
          {/* Dòng 1: Tiêu đề công việc */}
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              task.done && styles.titleDone,
            ]}
          >
            {task.title}
          </Text>

          {/* Dòng 2: Danh mục & Hạn hoàn thành */}
          <View style={styles.metaRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>

            <Text style={styles.dueDateText}>Hạn: {task.dueDate}</Text>
          </View>

          {/* Dòng 3: Nhãn Mức ưu tiên & Nhãn Quá hạn */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: priorityStyle.bg,
                  borderColor: priorityStyle.borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: priorityStyle.textColor },
                ]}
              >
                {task.priority}
              </Text>
            </View>

            {overdue && (
              <View style={[styles.badge, styles.overdueBadge]}>
                <Text style={styles.overdueBadgeText}>Quá hạn</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDone: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primaryDark,
  },
  dueDateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  overdueBadge: {
    backgroundColor: colors.dangerLight,
    borderColor: '#FCA5A5',
  },
  overdueBadgeText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
});
