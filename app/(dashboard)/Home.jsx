import { StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { useGroups } from '../../hooks/useGroups'

import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'

const Home = () => {
  const { groups } = useGroups()

  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <ThemedText title>Home</ThemedText>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})