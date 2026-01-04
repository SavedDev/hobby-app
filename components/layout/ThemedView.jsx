import { View, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '../../constants/colors'

const ThemedView = ({ style, safe = false, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
        },
        safe && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        },
        style
      ]}
      {...props}
    />
  )
}

export default ThemedView