import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/task';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.task ? 'Sửa công việc' : 'Thêm công việc',
          headerBackTitle: 'Trở lại',
        })}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: 'Chi tiết công việc',
          headerBackTitle: 'Trở lại',
        }}
      />
    </Stack.Navigator>
  );
};
