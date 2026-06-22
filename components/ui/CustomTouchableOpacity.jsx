import { TouchableOpacity } from 'react-native'

const CustomTouchableOpacity = ({ children, style, activeOpacity = 0.7, ...props }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={style}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Makes it easier to tap!
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}

export default CustomTouchableOpacity