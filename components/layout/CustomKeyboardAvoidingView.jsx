import { KeyboardAvoidingView, Platform } from 'react-native'

const CustomKeyboardAvoidingView = ({ children, ...props }) => {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120} // Adjust based on your tab bar height
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardAvoidingView