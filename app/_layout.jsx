import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { Colors } from '../constants/colors'
import { UserProvider } from '../contexts/UserContext'
import { GroupProvider } from '../contexts/GroupContext'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors['light']

  return (
    <UserProvider>
      <GroupProvider>
        <StatusBar value='auto' />

        <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title
        }}>
          <Stack.Screen name='index' options={{ title: 'Home' }} />
          <Stack.Screen name='Hobbies' options={{ title: 'Hobbies' }} />
          <Stack.Screen name='(auth)' options={{ headerShown: false, }} />
          <Stack.Screen name='(dashboard)' options={{ headerShown: false, }} />
        </Stack>
      </GroupProvider>
    </UserProvider>
  )
}

export default RootLayout