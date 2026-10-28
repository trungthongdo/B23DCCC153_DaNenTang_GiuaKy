import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { AppIcon } from './AppIcon';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  accessibilityLabel = 'Đánh dấu hoàn thành',
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.box,
        checked ? styles.boxChecked : styles.boxUnchecked,
        pressed && styles.boxPressed,
      ]}
    >
      {checked && <AppIcon name="check" size={14} color={colors.surface} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.8,
  },
  boxUnchecked: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  boxPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },
});
