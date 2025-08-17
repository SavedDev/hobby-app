import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors['light']

  return (
    <>
      <StatusBar value='auto' />

      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title
      }}>
        <Stack.Screen name='index' options={{ title: 'Home' }} />
        <Stack.Screen name='hobbies' options={{ title: 'Hobbies' }} />
      </Stack>
    </>
  )
}

export default RootLayout