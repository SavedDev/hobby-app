import { StyleSheet } from 'react-native'

import { useUser } from '../../hooks/useUser'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'

const Profile = () => {
  const { logout, user } = useUser()

  return (
    <ThemedView style={styles.container}>
      <ThemedText title>Profile</ThemedText>

      <Spacer height={20} />

      <ThemedText>Email: {user?.email}</ThemedText>

      <Spacer height={20} />

      <ThemedButton onPress={logout} title='Logout' />
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})