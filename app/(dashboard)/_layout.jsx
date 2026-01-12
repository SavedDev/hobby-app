import { useColorScheme } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import { Colors } from '../../constants/colors'
import UserOnly from '../../components/auth/UserOnly'

const DashboardLayout = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 90,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}
      >
        <Tabs.Screen
          name='Home'
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={30}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />
        <Tabs.Screen
          name='groups'
          options={{
            title: 'Groups',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'account-group' : 'account-group-outline'}
                size={30}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />
        <Tabs.Screen
          name='Social'
          options={{
            title: 'Social',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'map-marker-radius' : 'map-marker-radius-outline'}
                size={24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />
        <Tabs.Screen
          name='Profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            )
          }}
        />

        {/* <Tabs.Screen
          name='groups'
        // options={{ href: null, }}
        /> */}
      </Tabs>
    </UserOnly>
  )
}

export default DashboardLayout