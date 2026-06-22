import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'

import { Colors } from '../../constants/colors'
import ThemedText from '../ui/ThemedText'
import Spacer from '../layout/Spacer'
import CustomTouchableOpacity from "../ui/CustomTouchableOpacity"

const ThemedOptionSelector = ({ style, label, options, current, setter, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View style={styles.optionContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Spacer />
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <CustomTouchableOpacity
            key={opt}
            style={[styles.chip, current === opt && styles.chipActive]}
            onPress={() => setter(opt)}
          >
            <ThemedText style={[styles.chipText, current === opt && styles.chipTextActive]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </ThemedText>
          </CustomTouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default ThemedOptionSelector

const styles = StyleSheet.create({
  optionContainer: {},
  label: { fontSize: 14, fontWeight: '700', opacity: 0.8 },

  // Chip Selectors
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#007AFF10',
    borderColor: '#007AFF',
  },
  chipText: { fontSize: 14, fontWeight: '600', opacity: 0.6 },
  chipTextActive: { color: '#007AFF', opacity: 1 },
})