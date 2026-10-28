import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.textProgress}>
          Đã hoàn thành <Text style={styles.textHighlight}>{completed}/{total}</Text> công việc
        </Text>
        <Text style={styles.textPercent}>{clampedPercentage}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedPercentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textProgress: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  textHighlight: {
    fontWeight: '700',
    color: colors.primary,
  },
  textPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
