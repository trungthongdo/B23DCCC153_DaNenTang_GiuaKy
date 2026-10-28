import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { TaskCard } from '../components/TaskCard';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { colors } from '../theme/colors';
import { FilterStatus, RootStackParamList, SortOption, Task } from '../types/task';
import {
  getPriorityWeight,
  isOverdue,
  parseDate,
} from '../utils/dateUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

const FILTER_TABS: FilterStatus[] = ['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn'];

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Tất cả');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Tải danh sách công việc mỗi khi màn hình được focus
  const fetchTasks = useCallback(async () => {
    const loaded = await loadTasks();
    setTasks(loaded);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  // Số lượng công việc hoàn thành và tổng số việc
  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.done).length;
  }, [tasks]);

  const totalCount = tasks.length;

  // Xử lý chuyển đổi trạng thái hoàn thành (checkbox)
  const handleToggleDone = async (taskId: string) => {
    const updated = tasks.map((item) =>
      item.id === taskId ? { ...item, done: !item.done } : item
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  // Xử lý xoá 1 công việc khi nhấn giữ (onLongPress)
  const handleLongPressDelete = (task: Task) => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const updated = tasks.filter((t) => t.id !== task.id);
            setTasks(updated);
            await saveTasks(updated);
          },
        },
      ]
    );
  };

  // Xử lý xoá tất cả các việc đã hoàn thành
  const handleDeleteCompleted = () => {
    if (completedCount === 0) {
      return;
    }

    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Bạn có chắc chắn muốn xoá ${completedCount} công việc đã hoàn thành không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá tất cả',
          style: 'destructive',
          onPress: async () => {
            const updated = tasks.filter((t) => !t.done);
            setTasks(updated);
            await saveTasks(updated);
          },
        },
      ]
    );
  };

  // Lọc, tìm kiếm và sắp xếp hoạt động đồng thời
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Tìm kiếm theo tên không phân biệt hoa/thường
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    // 2. Lọc theo trạng thái
    if (filterStatus === 'Chưa xong') {
      result = result.filter((t) => !t.done);
    } else if (filterStatus === 'Đã xong') {
      result = result.filter((t) => t.done);
    } else if (filterStatus === 'Quá hạn') {
      result = result.filter((t) => isOverdue(t.dueDate, t.done));
    }

    // 3. Sắp xếp
    if (sortBy === 'dueDate') {
      // Hạn hoàn thành gần nhất lên đầu
      result.sort((a, b) => {
        const dateA = parseDate(a.dueDate)?.getTime() ?? 0;
        const dateB = parseDate(b.dueDate)?.getTime() ?? 0;
        return dateA - dateB;
      });
    } else if (sortBy === 'priority') {
      // Mức ưu tiên: Cao -> Trung bình -> Thấp
      result.sort((a, b) => {
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      });
    }

    return result;
  }, [tasks, searchQuery, filterStatus, sortBy]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header thanh lịch, gọn gàng */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Kế hoạch cá nhân</Text>
          <Text style={styles.headerSubtitle}>Quản lý và theo dõi công việc</Text>
        </View>

        {/* Nút Xoá việc đã hoàn thành */}
        <Pressable
          onPress={handleDeleteCompleted}
          disabled={completedCount === 0}
          style={({ pressed }) => [
            styles.deleteCompletedBtn,
            completedCount === 0 && styles.deleteCompletedBtnDisabled,
            pressed && styles.deleteCompletedBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Xoá việc đã hoàn thành (${completedCount})`}
        >
          <Text
            style={[
              styles.deleteCompletedBtnText,
              completedCount === 0 && styles.deleteCompletedBtnTextDisabled,
            ]}
          >
            Xoá việc xong ({completedCount})
          </Text>
        </Pressable>
      </View>

      {/* Tiến độ hoàn thành */}
      <View style={styles.sectionPadding}>
        <ProgressBar completed={completedCount} total={totalCount} />
      </View>

      {/* Ô tìm kiếm với icon vector */}
      <View style={styles.searchContainer}>
        <AppIcon name="search" size={17} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm công việc..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchBtn}
            hitSlop={8}
            accessibilityLabel="Xoá tìm kiếm"
          >
            <AppIcon name="close" size={14} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Hàng nút lọc trạng thái */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => {
          const isSelected = filterStatus === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setFilterStatus(tab)}
              style={({ pressed }) => [
                styles.filterTab,
                isSelected && styles.filterTabSelected,
                pressed && styles.filterTabPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isSelected && styles.filterTabTextSelected,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Thanh tuỳ chọn sắp xếp */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        <Pressable
          onPress={() => setSortBy('dueDate')}
          style={({ pressed }) => [
            styles.sortBtn,
            sortBy === 'dueDate' && styles.sortBtnActive,
            pressed && styles.sortBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.sortBtnText,
              sortBy === 'dueDate' && styles.sortBtnTextActive,
            ]}
          >
            Hạn gần nhất
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSortBy('priority')}
          style={({ pressed }) => [
            styles.sortBtn,
            sortBy === 'priority' && styles.sortBtnActive,
            pressed && styles.sortBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.sortBtnText,
              sortBy === 'priority' && styles.sortBtnTextActive,
            ]}
          >
            Mức ưu tiên
          </Text>
        </Pressable>
      </View>

      {/* Danh sách công việc FlatList */}
      <FlatList
        data={filteredAndSortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleDone={handleToggleDone}
            onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
            onLongPress={handleLongPressDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            message={
              searchQuery.length > 0
                ? 'Không tìm thấy công việc phù hợp'
                : filterStatus === 'Quá hạn'
                ? 'Không có công việc nào bị quá hạn'
                : 'Chưa có công việc nào'
            }
            subMessage={
              searchQuery.length > 0
                ? `Không có kết quả nào cho từ khoá "${searchQuery}".`
                : 'Nhấn vào "+ Thêm việc" để bắt đầu lập kế hoạch.'
            }
          />
        }
      />

      {/* Nút "+ Thêm việc" tối giản, hiện đại */}
      <Pressable
        onPress={() => navigation.navigate('TaskForm', {})}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Thêm công việc mới"
      >
        <AppIcon name="plus" size={17} color={colors.surface} />
        <Text style={styles.fabText}>Thêm việc</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  deleteCompletedBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteCompletedBtnDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.border,
  },
  deleteCompletedBtnPressed: {
    opacity: 0.7,
  },
  deleteCompletedBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  deleteCompletedBtnTextDisabled: {
    color: colors.disabledText,
  },
  sectionPadding: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearSearchBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabPressed: {
    opacity: 0.8,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTabTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginRight: 8,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  sortBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortBtnPressed: {
    opacity: 0.75,
  },
  sortBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortBtnTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 22,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  fabText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
