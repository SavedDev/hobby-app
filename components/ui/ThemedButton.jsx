import { Pressable, StyleSheet } from 'react-native'

import { Colors } from '../../constants/colors'
import ThemedText from './ThemedText'

const ThemedButton = ({ style, title, textStyle, ...props }) => {

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]}
      {...props}
    >
      <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>
    </Pressable>
  )
}

export default ThemedButton

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  text: {
    textAlign: 'center',
    color: '#fff'
  }
})