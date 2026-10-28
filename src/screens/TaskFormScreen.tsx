import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppIcon } from '../components/AppIcon';
import { DatePickerModal } from '../components/DatePickerModal';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { colors } from '../theme/colors';
import {
  RootStackParamList,
  Task,
  TaskCategory,
  TaskPriority,
} from '../types/task';
import { getTodayStart, parseDate } from '../utils/dateUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskForm'>;
type FormRouteProp = RouteProp<RootStackParamList, 'TaskForm'>;

const CATEGORIES: TaskCategory[] = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
const PRIORITIES: TaskPriority[] = ['Cao', 'Trung bình', 'Thấp'];

export const TaskFormScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FormRouteProp>();
  const editingTask = route.params?.task;
  const isEditing = Boolean(editingTask);

  // Form states
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [note, setNote] = useState(editingTask?.note ?? '');
  const [category, setCategory] = useState<TaskCategory>(
    editingTask?.category ?? 'Học tập'
  );
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? 'Trung bình'
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Validation error states
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');

  // Validate form
  const validate = (): boolean => {
    let isValid = true;

    // 1. Kiểm tra tiêu đề: không được để trống và không quá 50 ký tự
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Tên công việc không được để trống.');
      isValid = false;
    } else if (trimmedTitle.length > 50) {
      setTitleError('Tên công việc không được vượt quá 50 ký tự.');
      isValid = false;
    } else {
      setTitleError('');
    }

    // 2. Kiểm tra hạn hoàn thành: đúng định dạng dd/mm/yyyy và là ngày có thật
    const trimmedDate = dueDate.trim();
    if (!trimmedDate) {
      setDueDateError('Vui lòng chọn hạn hoàn thành.');
      isValid = false;
    } else {
      const parsedDate = parseDate(trimmedDate);
      if (!parsedDate) {
        setDueDateError('Hạn hoàn thành không hợp lệ.');
        isValid = false;
      } else {
        // Khi thêm mới: hạn không được trước ngày hôm nay
        if (!isEditing) {
          const today = getTodayStart();
          if (parsedDate.getTime() < today.getTime()) {
            setDueDateError('Hạn hoàn thành không được trước ngày hôm nay.');
            isValid = false;
          } else {
            setDueDateError('');
          }
        } else {
          setDueDateError('');
        }
      }
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const currentTasks = await loadTasks();

    if (isEditing && editingTask) {
      // Cập nhật công việc hiện có
      const updatedList = currentTasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: title.trim(),
              note: note.trim() || undefined,
              category,
              priority,
              dueDate: dueDate.trim(),
            }
          : t
      );
      await saveTasks(updatedList);
    } else {
      // Tạo công việc mới
      const newTask: Task = {
        id: 'task_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
        title: title.trim(),
        note: note.trim() || undefined,
        category,
        priority,
        dueDate: dueDate.trim(),
        done: false,
      };
      const updatedList = [newTask, ...currentTasks];
      await saveTasks(updatedList);
    }

    navigation.goBack();
  };

  const getPriorityColor = (pri: TaskPriority) => {
    switch (pri) {
      case 'Cao':
        return colors.danger;
      case 'Trung bình':
        return colors.warning;
      case 'Thấp':
        return colors.success;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Trường 1: Tên công việc */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Tên công việc <Text style={styles.requiredMark}>*</Text>
              </Text>
              <Text style={styles.charCount}>{title.length}/50</Text>
            </View>
            <TextInput
              style={[styles.input, Boolean(titleError) && styles.inputError]}
              placeholder="Nhập tên công việc"
              placeholderTextColor={colors.textSecondary}
              value={title}
              maxLength={50}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) {
                  setTitleError('');
                }
              }}
            />
            {Boolean(titleError) && (
              <Text style={styles.errorText}>{titleError}</Text>
            )}
          </View>

          {/* Trường 2: Ghi chú */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập ghi chú (không bắt buộc)"
              placeholderTextColor={colors.textSecondary}
              value={note}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              onChangeText={setNote}
            />
          </View>

          {/* Trường 3: Danh mục dạng chip */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Danh mục <Text style={styles.requiredMark}>*</Text>
            </Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={({ pressed }) => [
                      styles.chip,
                      isSelected && styles.chipSelected,
                      pressed && styles.chipPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Trường 4: Mức ưu tiên dạng chip */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mức ưu tiên <Text style={styles.requiredMark}>*</Text>
            </Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map((pri) => {
                const isSelected = priority === pri;
                const dotColor = getPriorityColor(pri);
                return (
                  <Pressable
                    key={pri}
                    onPress={() => setPriority(pri)}
                    style={({ pressed }) => [
                      styles.chip,
                      isSelected && styles.chipSelected,
                      pressed && styles.chipPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {pri}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Trường 5: Hạn hoàn thành với Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Hạn hoàn thành <Text style={styles.requiredMark}>*</Text>
            </Text>
            <Pressable
              onPress={() => setIsDatePickerVisible(true)}
              style={({ pressed }) => [
                styles.datePickerButton,
                Boolean(dueDateError) && styles.inputError,
                pressed && styles.datePickerButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Chọn hạn hoàn thành"
            >
              <AppIcon name="calendar" size={17} color={colors.primary} />
              <Text
                style={[
                  styles.datePickerText,
                  !dueDate && styles.datePickerPlaceholder,
                ]}
              >
                {dueDate || 'Chọn ngày hoàn thành'}
              </Text>
            </Pressable>
            {Boolean(dueDateError) && (
              <Text style={styles.errorText}>{dueDateError}</Text>
            )}
          </View>

          {/* Nút hành động Lưu & Huỷ */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Hủy"
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isEditing ? 'Lưu thay đổi' : 'Lưu công việc'}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Lưu thay đổi' : 'Lưu công việc'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bảng lịch Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerVisible}
        initialDateStr={dueDate}
        minDate={isEditing ? null : getTodayStart()}
        onConfirm={(selectedDateStr) => {
          setDueDate(selectedDateStr);
          setDueDateError('');
          setIsDatePickerVisible(false);
        }}
        onCancel={() => setIsDatePickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  requiredMark: {
    color: colors.danger,
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    height: 76,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    margin: 3,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  datePickerButtonPressed: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  datePickerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 8,
  },
  datePickerPlaceholder: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  saveButton: {
    height: 46,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
});
