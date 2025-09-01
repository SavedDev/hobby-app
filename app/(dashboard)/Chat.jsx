import { StyleSheet } from 'react-native'

import { useUser } from '../../hooks/useUser'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'

const Chat = () => {
  // const { logout, user } = useUser()

  return (
    <ThemedView style={styles.container}>
      <ThemedText title>Chat</ThemedText>
    </ThemedView>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})