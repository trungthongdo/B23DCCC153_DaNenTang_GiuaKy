import React from 'react';
import { StyleSheet, View } from 'react-native';

export type IconName =
  | 'search'
  | 'calendar'
  | 'check'
  | 'close'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-double-left'
  | 'chevron-double-right'
  | 'document';

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = '#1F2937',
}) => {
  const strokeWidth = 1.8;

  switch (name) {
    case 'search': {
      const circleSize = size * 0.65;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.searchCircle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderWidth: strokeWidth,
                borderColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.searchHandle,
              {
                width: strokeWidth,
                height: size * 0.38,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      );
    }

    case 'calendar': {
      const boxW = size * 0.82;
      const boxH = size * 0.8;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.calendarHookLeft,
              {
                left: size * 0.25,
                width: strokeWidth,
                height: size * 0.22,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.calendarHookRight,
              {
                right: size * 0.25,
                width: strokeWidth,
                height: size * 0.22,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.calendarBox,
              {
                width: boxW,
                height: boxH,
                borderWidth: strokeWidth,
                borderColor: color,
              },
            ]}
          >
            <View
              style={[
                styles.calendarLine,
                {
                  height: strokeWidth,
                  backgroundColor: color,
                  marginTop: size * 0.2,
                },
              ]}
            />
            <View style={styles.calendarDotsRow}>
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
              <View style={[styles.calendarDot, { backgroundColor: color }]} />
            </View>
          </View>
        </View>
      );
    }

    case 'check': {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.checkShortArm,
              {
                width: size * 0.3,
                height: strokeWidth,
                backgroundColor: color,
                bottom: size * 0.36,
                left: size * 0.16,
              },
            ]}
          />
          <View
            style={[
              styles.checkLongArm,
              {
                width: size * 0.58,
                height: strokeWidth,
                backgroundColor: color,
                bottom: size * 0.44,
                left: size * 0.32,
              },
            ]}
          />
        </View>
      );
    }

    case 'close': {
      const lineLen = size * 0.65;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.closeLine1,
              {
                width: lineLen,
                height: strokeWidth,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.closeLine2,
              {
                width: lineLen,
                height: strokeWidth,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      );
    }

    case 'plus': {
      const lineLen = size * 0.65;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.plusHorizontal,
              {
                width: lineLen,
                height: strokeWidth,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.plusVertical,
              {
                width: strokeWidth,
                height: lineLen,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      );
    }

    case 'trash': {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.trashLid,
              {
                width: size * 0.75,
                height: strokeWidth,
                backgroundColor: color,
                top: size * 0.22,
              },
            ]}
          />
          <View
            style={[
              styles.trashHandle,
              {
                width: size * 0.28,
                height: strokeWidth,
                backgroundColor: color,
                top: size * 0.12,
              },
            ]}
          />
          <View
            style={[
              styles.trashBody,
              {
                width: size * 0.54,
                height: size * 0.54,
                borderWidth: strokeWidth,
                borderColor: color,
                bottom: size * 0.1,
              },
            ]}
          >
            <View
              style={[
                styles.trashRib,
                { width: strokeWidth, backgroundColor: color },
              ]}
            />
          </View>
        </View>
      );
    }

    case 'edit': {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.editBar,
              {
                width: size * 0.58,
                height: size * 0.22,
                borderWidth: strokeWidth,
                borderColor: color,
                top: size * 0.28,
                left: size * 0.2,
              },
            ]}
          />
          <View
            style={[
              styles.editTip,
              {
                width: size * 0.14,
                height: size * 0.14,
                borderBottomWidth: strokeWidth,
                borderLeftWidth: strokeWidth,
                borderColor: color,
                bottom: size * 0.16,
                left: size * 0.16,
              },
            ]}
          />
        </View>
      );
    }

    case 'chevron-left': {
      const armLen = size * 0.38;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.chevronLeftTop,
              {
                width: armLen,
                height: strokeWidth,
                backgroundColor: color,
                top: size * 0.34,
                left: size * 0.3,
              },
            ]}
          />
          <View
            style={[
              styles.chevronLeftBottom,
              {
                width: armLen,
                height: strokeWidth,
                backgroundColor: color,
                bottom: size * 0.34,
                left: size * 0.3,
              },
            ]}
          />
        </View>
      );
    }

    case 'chevron-right': {
      const armLen = size * 0.38;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.chevronRightTop,
              {
                width: armLen,
                height: strokeWidth,
                backgroundColor: color,
                top: size * 0.34,
                right: size * 0.3,
              },
            ]}
          />
          <View
            style={[
              styles.chevronRightBottom,
              {
                width: armLen,
                height: strokeWidth,
                backgroundColor: color,
                bottom: size * 0.34,
                right: size * 0.3,
              },
            ]}
          />
        </View>
      );
    }

    case 'chevron-double-left': {
      return (
        <View style={[styles.container, styles.row, { width: size, height: size }]}>
          <AppIcon name="chevron-left" size={size * 0.75} color={color} />
          <View style={{ marginLeft: -size * 0.3 }}>
            <AppIcon name="chevron-left" size={size * 0.75} color={color} />
          </View>
        </View>
      );
    }

    case 'chevron-double-right': {
      return (
        <View style={[styles.container, styles.row, { width: size, height: size }]}>
          <AppIcon name="chevron-right" size={size * 0.75} color={color} />
          <View style={{ marginLeft: -size * 0.3 }}>
            <AppIcon name="chevron-right" size={size * 0.75} color={color} />
          </View>
        </View>
      );
    }

    case 'document': {
      const docW = size * 0.7;
      const docH = size * 0.85;
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <View
            style={[
              styles.docBox,
              {
                width: docW,
                height: docH,
                borderWidth: strokeWidth,
                borderColor: color,
              },
            ]}
          >
            <View style={[styles.docLine1, { height: strokeWidth, backgroundColor: color }]} />
            <View style={[styles.docLine2, { height: strokeWidth, backgroundColor: color }]} />
            <View style={[styles.docLine3, { height: strokeWidth, backgroundColor: color }]} />
          </View>
        </View>
      );
    }

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  searchCircle: {
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    position: 'absolute',
    bottom: 1.5,
    right: 3.5,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  calendarHookLeft: {
    position: 'absolute',
    top: 0,
    borderRadius: 1,
    zIndex: 2,
  },
  calendarHookRight: {
    position: 'absolute',
    top: 0,
    borderRadius: 1,
    zIndex: 2,
  },
  calendarBox: {
    borderRadius: 4,
    position: 'absolute',
    bottom: 1,
    overflow: 'hidden',
  },
  calendarLine: {
    width: '100%',
  },
  calendarDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    marginTop: 3,
  },
  calendarDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
  },
  checkShortArm: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  checkLongArm: {
    position: 'absolute',
    transform: [{ rotate: '-48deg' }],
    borderRadius: 1,
  },
  closeLine1: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  closeLine2: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  plusHorizontal: {
    position: 'absolute',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    borderRadius: 1,
  },
  trashLid: {
    position: 'absolute',
    borderRadius: 1,
  },
  trashHandle: {
    position: 'absolute',
    borderRadius: 1,
  },
  trashBody: {
    borderTopWidth: 0,
    position: 'absolute',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashRib: {
    height: '60%',
    borderRadius: 1,
  },
  editBar: {
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  editTip: {
    position: 'absolute',
  },
  chevronLeftTop: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  chevronLeftBottom: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  chevronRightTop: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  chevronRightBottom: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  docBox: {
    borderRadius: 4,
    padding: 3,
    justifyContent: 'space-around',
  },
  docLine1: {
    width: '80%',
    borderRadius: 1,
  },
  docLine2: {
    width: '60%',
    borderRadius: 1,
  },
  docLine3: {
    width: '70%',
    borderRadius: 1,
  },
});
