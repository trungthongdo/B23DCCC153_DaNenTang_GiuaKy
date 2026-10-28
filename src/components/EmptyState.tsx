import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { AppIcon } from './AppIcon';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Không có công việc nào',
  subMessage = 'Thử thay đổi bộ lọc hoặc thêm công việc mới.',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <AppIcon name="document" size={28} color={colors.primary} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {subMessage ? <Text style={styles.subMessage}>{subMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
