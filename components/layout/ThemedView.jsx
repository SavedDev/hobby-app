import { View, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '../../constants/colors'

const ThemedView = ({ style, safe = false, noBottomPadding = false, ...props }) => {
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
          paddingBottom: noBottomPadding ? 0 : insets.bottom
        },
        style
      ]}
      {...props}
    />
  )
}

export default ThemedView