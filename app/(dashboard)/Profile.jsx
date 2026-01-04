import { StyleSheet } from 'react-native'

import { useUser } from '../../hooks/useUser'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import { Link } from 'expo-router'

const Profile = () => {
  const { logout, deleteAccount, user } = useUser()

  return (
    <ThemedView style={styles.container}>
      <ThemedText title>Profile</ThemedText>

      <Spacer height={20} />

      <ThemedText>Username: {user?.username}</ThemedText>
      <Link href="/Username">
        <ThemedText>Create Username</ThemedText>
      </Link>

      <ThemedText>Email: {user?.email}</ThemedText>

      <Spacer height={20} />

      <ThemedButton onPress={logout} title='Logout' />
      <Spacer height={20} />
      <ThemedButton onPress={deleteAccount} title='Delete Account' />
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