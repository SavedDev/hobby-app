import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../../constants/colors'

export default function GroupsLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}
    >
      {/* Main List */}
      <Stack.Screen name="index" options={{ title: 'Groups', headerShown: false }} />

      {/* Create Modal */}
      <Stack.Screen name="CreateGroup" options={{ title: 'Create', headerShown: false, presentation: 'modal', gestureEnabled: false }} />

      {/* Dynamic Folder Routes */}

      {/* Note: Group details page */}
      <Stack.Screen name="[groupId]/index" options={{ title: 'Group Details', headerShown: false }} />

      {/* Note: Edit group page */}
      <Stack.Screen name="[groupId]/edit" options={{ title: 'Edit Group', headerShown: false, presentation: 'modal', gestureEnabled: false }} />
    </Stack>
  )
}
