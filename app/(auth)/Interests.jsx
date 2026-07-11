import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  LayoutAnimation,
  useColorScheme,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { POPULAR_CATEGORIES } from '../../constants/categories'
import { Colors } from '../../constants/colors'

import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import CustomTouchableOpacity from '../../components/ui/CustomTouchableOpacity'
import Spacer from '../../components/layout/Spacer'

const { width } = Dimensions.get('window')
const COLUMN_WIDTH = (width - 60) / 2 // 2 columns with padding

const Interests = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const [selectedIds, setSelectedIds] = useState([])

  const toggleInterest = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    )
  }

  const handleContinue = () => {
    // TODO: persist selected interests to the user profile
    router.replace('/(dashboard)/Profile')
  }

  const selectionCount = selectedIds.length
  const isReady = selectionCount >= 3

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.progressTrack, { backgroundColor: theme.navBackground }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min((selectionCount / 3) * 100, 100)}%` }
            ]}
          />
        </View>
        <CustomTouchableOpacity onPress={() => router.replace('/(dashboard)/Home')}>
          <ThemedText style={styles.skipBtn}>Skip</ThemedText>
        </CustomTouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Spacer height={10} />
        <ThemedText style={styles.emojiTitle}>✨</ThemedText>
        <ThemedText title style={styles.mainTitle}>What are you into?</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pick at least <ThemedText style={styles.highlight}>3 interests</ThemedText> so we can find the best groups for you.
        </ThemedText>

        <Spacer height={30} />

        <View style={styles.grid}>
          {POPULAR_CATEGORIES.map((item) => {
            const isSelected = selectedIds.includes(item.id)
            return (
              <CustomTouchableOpacity
                key={item.id}
                onPress={() => toggleInterest(item.id)}
                style={[
                  styles.interestCard,
                  { backgroundColor: theme.uiBackground },
                  isSelected && styles.interestCardActive
                ]}
              >
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.icon}>{item.icon}</ThemedText>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                  )}
                </View>
                <ThemedText style={[styles.label, isSelected && styles.labelActive]}>
                  {item.label}
                </ThemedText>
              </CustomTouchableOpacity>
            )
          })}
        </View>
        <Spacer height={100} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <ThemedButton
          title={isReady ? "Let's Go!" : `Pick ${3 - selectionCount} more`}
          onPress={handleContinue}
          disabled={!isReady}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    marginRight: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  skipBtn: {
    opacity: 0.5,
    fontWeight: '600',
  },
  scrollContent: { paddingHorizontal: 20 },
  emojiTitle: { fontSize: 40, marginBottom: 10 },
  mainTitle: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { fontSize: 16, opacity: 0.6, marginTop: 10, lineHeight: 22 },
  highlight: { color: Colors.primary, fontWeight: '700' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestCard: {
    width: COLUMN_WIDTH,
    height: 110,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: { fontSize: 30 },
  label: { fontSize: 16, fontWeight: '700' },
  labelActive: { color: '#FFF' },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    paddingBottom: 40,
  },
})

export default Interests