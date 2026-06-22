import { Pressable, StyleSheet, TextInput, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

import { Colors } from '../../constants/colors'
import ThemedText from '../ui/ThemedText'
import Spacer from '../layout/Spacer'
import CustomTouchableOpacity from '../ui/CustomTouchableOpacity'

const ThemedTextInput = ({
  inputStyle,
  inputContainerStyle,
  width = '100%',
  title,
  secureTextEntry,
  showPasswordEye = true,
  icon = false,
  iconName = 'search',
  iconSize = 24,
  iconStyle,
  buttonIcon,
  ...props
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true)

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] || Colors.light

  const handleShowPassword = () => {
    setPasswordHidden(!passwordHidden)
  }

  return (
    <View style={{ width }}>
      {title && <ThemedText>{title}</ThemedText>}
      <Spacer />
      <View style={[styles.container, inputContainerStyle]}>
        <TextInput
          style={[
            {
              backgroundColor: theme.uiBackground,
              color: theme.text,
              paddingLeft: icon ? 42 : 20,
              marginRight: buttonIcon ? 10 : 0,
            },
            styles.input,
            inputStyle,
          ]}
          placeholderTextColor='#9591a5'
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
        {buttonIcon &&
          <CustomTouchableOpacity
            style={[styles.button, !props.value && styles.buttonDisabled]}
            disabled={!props.value}
          >
            {buttonIcon}
          </CustomTouchableOpacity>
        }
      </View>
    </View>
  )
}

export default ThemedTextInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    width: '100%',
    borderRadius: 6,
    padding: 15,
    // TODO: transfer these to the Chat component
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
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D6',
  },
})