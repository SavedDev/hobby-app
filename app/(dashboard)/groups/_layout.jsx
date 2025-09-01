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
      <Stack.Screen name="index" options={{ title: 'Groups', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Group' }} />
    </Stack>
  )
}
