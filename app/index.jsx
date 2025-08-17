import { Image, StyleSheet, Text } from 'react-native'
import { Link } from 'expo-router'
import Icon from "../assets/favicon.png"
import ThemedView from '../components/ThemedView'
import Spacer from '../components/Spacer'
import ThemedText from '../components/ThemedText'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <Image source={Icon} />

      <ThemedText title>Get back to your hobbies</ThemedText>

      <Spacer height={15} />

      <Link href="/hobbies">
        <ThemedText>Hobbies</ThemedText>
      </Link>
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
  title: {
    color: '#000'
  }
})