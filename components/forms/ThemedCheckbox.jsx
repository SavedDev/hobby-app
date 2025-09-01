import { StyleSheet, View } from 'react-native'
import Checkbox from 'expo-checkbox'

import ThemedText from '../ui/ThemedText'

const ThemedCheckbox = ({ style, title, checkboxValue, setCheckboxValue }) => {

  return (
    <View style={[styles.container, style]}>
      <Checkbox value={checkboxValue} onValueChange={setCheckboxValue} />
      <ThemedText>{title}</ThemedText>
    </View>
  )
}

export default ThemedCheckbox

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
})