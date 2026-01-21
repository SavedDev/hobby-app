import { Modal, View, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native'
import { use, useEffect, useState } from 'react'

import { Colors } from '../../constants/colors'
import ThemedButton from './ThemedButton'
import ThemedText from './ThemedText'
import ThemedView from '../layout/ThemedView'

const ThemedModal = ({ style, openEl, closeModal, setCloseModal, children }) => {
  const [openModal, setOpenModal] = useState(false)

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleOpenModal = () => {
    setOpenModal(true)

    if (setCloseModal) {
      setCloseModal(false)
    }
  }

  useEffect(() => {
    if (closeModal) {
      setOpenModal(false)
    }
  }, [closeModal])

  return (
    <>
      <TouchableOpacity
        // title={openEl || 'Open Modal'}
        onPress={handleOpenModal}
        textStyle={{ color: '#fff' }}
      >
        {openEl || <ThemedText>Open Modal</ThemedText>}
      </TouchableOpacity>

      <Modal
        visible={openModal}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle='pageSheet'
      >
        <ThemedView style={styles.container}>
          <ThemedText>{children}</ThemedText>
          <ThemedButton title="Close Modal" onPress={handleCloseModal} textStyle={{ color: '#fff' }} />
        </ThemedView>
      </Modal>
    </>
  )
}

export default ThemedModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30
  }
})