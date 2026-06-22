import React, { useState, useRef } from 'react'
import { Modal, StyleSheet, View, Pressable, useColorScheme, Platform, Animated, Dimensions } from 'react-native'
import ThemedText from './ThemedText'
import CustomTouchableOpacity from './CustomTouchableOpacity'
import Spacer from '../layout/Spacer'
import { Colors } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

const SCREEN_HEIGHT = Dimensions.get('window').height

const ThemedOptionsMenu = ({ dotsStyles, dotsSize = 30, options = [] }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const openMenu = () => {
    setModalVisible(true)
    // Run background fade and menu slide in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // menu slide
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false)
    })
  }

  return (
    <>
      <CustomTouchableOpacity style={[styles.dots, dotsStyles]} onPress={openMenu}>
        <Ionicons name="ellipsis-horizontal" size={dotsSize} color={theme.neutral} />
      </CustomTouchableOpacity>

      <Modal transparent visible={modalVisible} onRequestClose={closeMenu}>
        <View style={styles.container}>
          {/* Fading Backdrop */}
          <Animated.View
            style={[styles.overlay, { opacity: fadeAnim }]}
          >
            <Pressable style={{ flex: 1 }} onPress={closeMenu} />
          </Animated.View>

          {/* Sliding Sheet */}
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.uiBackground,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.handle, { backgroundColor: theme.text, opacity: 0.2 }]} />
            <Spacer height={10} />

            {options.map((option, index) => (
              <CustomTouchableOpacity
                key={index}
                style={[styles.optionBtn, { borderBottomColor: theme.text + '1A' }]}
                onPress={() => {
                  closeMenu()
                  // Minor delay to let the menu slide down before triggering logic
                  setTimeout(() => option.onPress(), 300)
                }}
              >
                <ThemedText style={[
                  styles.optionText,
                  { color: option.destructive ? '#FF3B30' : theme.text }
                ]}>
                  {option.label}
                </ThemedText>
              </CustomTouchableOpacity>
            ))}

            <Spacer height={10} />

            <CustomTouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.text + '0D' }]}
              onPress={closeMenu}
            >
              <ThemedText style={[styles.cancelText, { color: theme.text }]}>Cancel</ThemedText>
            </CustomTouchableOpacity>

            <Spacer height={Platform.OS === 'ios' ? 40 : 20} />
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dots: {
    backgroundColor: '#c9c9c9ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    width: '100%',
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
  },
  optionBtn: {
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  cancelText: {
    fontWeight: '700',
  },
})

export default ThemedOptionsMenu