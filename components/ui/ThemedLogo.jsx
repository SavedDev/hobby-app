import { Image, useColorScheme } from 'react-native'

import { Colors } from '../../constants/colors'

const ThemedLogo = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <Image source={null} />
  )
}

export default ThemedLogo