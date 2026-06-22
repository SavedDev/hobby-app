import { Modal, StyleSheet, View, Dimensions, Pressable } from 'react-native'
import ThemedText from './ThemedText'
import Spacer from '../layout/Spacer'
import CustomTouchableOpacity from './CustomTouchableOpacity'

const { width } = Dimensions.get('window')

const PopUpModal = ({
  visible,
  onCancel,
  onConfirm,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmColor = "#FF3B30" // Defaults to destructive red
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      {/* Pressable overlay allows closing by tapping outside the card */}
      <Pressable style={styles.overlay} onPress={onCancel}>

        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <ThemedText title style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <Spacer height={25} />

          <View style={styles.buttonContainer}>
            <CustomTouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelText}>{cancelText}</ThemedText>
            </CustomTouchableOpacity>

            <CustomTouchableOpacity
              style={[styles.btn, { backgroundColor: confirmColor }]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.confirmText}>{confirmText}</ThemedText>
            </CustomTouchableOpacity>
          </View>
        </Pressable>

      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F2F2F7',
  },
  cancelText: {
    fontWeight: '700',
    color: '#000',
  },
  confirmText: {
    fontWeight: '700',
    color: '#FFF',
  },
})

export default PopUpModal