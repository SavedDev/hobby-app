import { Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

import { Colors } from '../../constants/colors'
import ThemedText from '../ui/ThemedText'

const ThemedTextInput = ({
  style,
  title,
  secureTextEntry,
  showPasswordEye = true,
  icon = false,
  iconName = 'search',
  iconSize = 24,
  iconStyle,
  ...props
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true)

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] || Colors.light

  const handleShowPassword = () => {
    setPasswordHidden(!passwordHidden)
  }

  return (
    <View style={{ width: 300 }}>
      {title && <ThemedText>{title}</ThemedText>}
      <View style={[styles.iconContainer, { backgroundColor: theme.uiBackground }]}>
        <TextInput
          style={[
            {
              width: '100%',
              backgroundColor: theme.uiBackground,
              color: theme.text,
              borderRadius: 6,
              padding: 20,
            },
            { paddingLeft: icon ? 42 : 20 },
            style,
          ]}
          secureTextEntry={secureTextEntry && passwordHidden}
          {...props}
        />
        {icon &&
          <Ionicons
            name={iconName}
            size={iconSize}
            style={[
              icon.styles,
              styles.icon,
            ]}
          />
        }
        {secureTextEntry && showPasswordEye &&
          <Pressable style={styles.pressable} onPress={handleShowPassword}>
            <Ionicons
              name={passwordHidden ? 'eye' : 'eye-off'}
              size={iconSize}
              style={styles.icon}
            />
          </Pressable>
        }
      </View>
    </View>
  )
}

export default ThemedTextInput

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressable: {
    width: 45,
    height: '100%',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
    color: "#505050",
  },
})