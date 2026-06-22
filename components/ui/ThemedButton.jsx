import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'

import { Colors } from '../../constants/colors'
import ThemedText from './ThemedText'
import CustomTouchableOpacity from './CustomTouchableOpacity'

const ThemedButton = ({ style, title, textStyle, loading = false, disabled, ...props }) => {
  // Combine both states into one check
  const isInactive = loading || disabled

  return (
    <CustomTouchableOpacity
      // Fix: Use the ternary operator to apply the style object correctly
      style={[
        styles.button,
        isInactive ? styles.disabled : null,
        style
      ]}
      disabled={isInactive}
      {...props}
    >
      <ThemedText style={[styles.text, textStyle]}>
        {loading ? 'Loading...' : title}
      </ThemedText>
    </CustomTouchableOpacity>
  )
}

export default ThemedButton

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    textAlign: 'center',
    color: '#fff'
  }
})