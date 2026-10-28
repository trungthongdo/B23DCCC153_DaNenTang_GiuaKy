import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { colors } from '../theme/colors';
import { RootStackParamList, Task, TaskPriority } from '../types/task';
import { getRemainingDaysInfo, isOverdue } from '../utils/dateUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;
type DetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | null>(null);

  // Tải chi tiết công việc khi màn hình được hiển thị hoặc quay lại từ Form Sửa
  const fetchTaskDetail = useCallback(async () => {
    const list = await loadTasks();
    const found = list.find((t) => t.id === taskId);
    if (found) {
      setTask(found);
    } else {
      setTask(null);
    }
  }, [taskId]);

  useFocusEffect(
    useCallback(() => {
      fetchTaskDetail();
    }, [fetchTaskDetail])
  );

  if (!task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy công việc này.</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại danh sách"
        >
          <Text style={styles.backButtonText}>Quay lại danh sách</Text>
        </Pressable>
      </View>
    );
  }

  const overdue = isOverdue(task.dueDate, task.done);
  const remainingInfo = getRemainingDaysInfo(task.dueDate, task.done);

  // Toggle trạng thái hoàn thành
  const handleToggleDone = async () => {
    const list = await loadTasks();
    const updated = list.map((item) =>
      item.id === task.id ? { ...item, done: !item.done } : item
    );
    await saveTasks(updated);
    setTask({ ...task, done: !task.done });
  };

  // Xoá công việc
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const list = await loadTasks();
            const updated = list.filter((item) => item.id !== task.id);
            await saveTasks(updated);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'Cao':
        return {
          bg: colors.dangerLight,
          color: colors.danger,
          border: '#FCA5A5',
        };
      case 'Trung bình':
        return {
          bg: colors.warningLight,
          color: colors.warning,
          border: '#FCD34D',
        };
      case 'Thấp':
        return {
          bg: colors.successLight,
          color: colors.success,
          border: '#86EFAC',
        };
    }
  };

  const priStyle = getPriorityStyle(task.priority);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" />
      {/* Thẻ chính hiển thị chi tiết */}
      <View style={styles.card}>
        {/* Hàng trạng thái & nhãn  */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.statusChip,
              task.done ? styles.statusDoneChip : styles.statusPendingChip,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: task.done ? colors.success : colors.primary },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                task.done ? styles.statusDoneText : styles.statusPendingText,
              ]}
            >
              {task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </Text>
          </View>

          {overdue && (
            <View style={styles.overdueChip}>
              <Text style={styles.overdueText}>Quá hạn</Text>
            </View>
          )}
        </View>

        {/* Tên công việc */}
        <Text
          style={[
            styles.title,
            task.done && styles.titleDone,
          ]}
        >
          {task.title}
        </Text>

        {/* Hộp hiển thị số ngày còn lại / quá hạn */}
        <View
          style={[
            styles.timeInfoBox,
            remainingInfo.isOverdueStatus ? styles.timeInfoBoxOverdue : styles.timeInfoBoxNormal,
          ]}
        >
          <Text
            style={[
              styles.timeInfoText,
              remainingInfo.isOverdueStatus ? styles.timeInfoTextOverdue : styles.timeInfoTextNormal,
            ]}
          >
            {remainingInfo.text}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Các dòng thông tin chi tiết */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Danh mục</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{task.category}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mức ưu tiên</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priStyle.bg, borderColor: priStyle.border },
            ]}
          >
            <Text style={[styles.priorityBadgeText, { color: priStyle.color }]}>
              {task.priority}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hạn hoàn thành</Text>
          <Text style={styles.infoValue}>{task.dueDate}</Text>
        </View>

        {/* Ghi chú nếu có */}
        {Boolean(task.note) && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Ghi chú</Text>
            <Text style={styles.noteContent}>{task.note}</Text>
          </View>
        )}
      </View>

      {/* Các nút hành động nghiệp vụ ) */}
      <View style={styles.buttonContainer}>
        {/* Nút Đánh dấu hoàn thành / Chưa hoàn thành */}
        <Pressable
          onPress={handleToggleDone}
          style={({ pressed }) => [
            styles.actionButton,
            task.done ? styles.undoButton : styles.completeButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        >
          <Text
            style={[
              styles.actionButtonText,
              task.done ? styles.undoButtonText : styles.completeButtonText,
            ]}
          >
            {task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          </Text>
        </Pressable>

        {/* Nút Sửa công việc */}
        <Pressable
          onPress={() => navigation.navigate('TaskForm', { task })}
          style={({ pressed }) => [
            styles.actionButton,
            styles.editButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Chỉnh sửa công việc"
        >
          <Text style={styles.editButtonText}>Sửa công việc</Text>
        </Pressable>

        {/* Nút Xoá công việc */}
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Xóa công việc"
        >
          <Text style={styles.deleteButtonText}>Xóa công việc</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDoneChip: {
    backgroundColor: colors.successLight,
  },
  statusPendingChip: {
    backgroundColor: colors.primaryLight,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDoneText: {
    color: colors.success,
  },
  statusPendingText: {
    color: colors.primaryDark,
  },
  overdueChip: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  overdueText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 25,
    marginBottom: 10,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  timeInfoBox: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    marginBottom: 12,
  },
  timeInfoBoxNormal: {
    backgroundColor: colors.primaryLight,
  },
  timeInfoBoxOverdue: {
    backgroundColor: colors.dangerLight,
  },
  timeInfoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timeInfoTextNormal: {
    color: colors.primaryDark,
  },
  timeInfoTextOverdue: {
    color: colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noteContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },
  buttonContainer: {
    gap: 8,
  },
  actionButton: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  completeButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  undoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  undoButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
