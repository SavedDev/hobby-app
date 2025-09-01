import { Image, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import Icon from "../assets/favicon.png"

import Spacer from '../components/layout/Spacer'
import ThemedView from '../components/layout/ThemedView'
import ThemedText from '../components/ui/ThemedText'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <Image source={Icon} />

      <ThemedText title>Get back to your hobbies</ThemedText>

      <Spacer height={15} />

      <Link href="/Hobbies">
        <ThemedText>Hobbies</ThemedText>
      </Link>

      <Spacer height={15} />

      <Link href="/Login">
        <ThemedText>Login</ThemedText>
      </Link>

      <Spacer height={15} />

      <Link href="/Profile">
        <ThemedText>Profile</ThemedText>
      </Link>
      <Spacer height={15} />
      <Link href="/Home">
        <ThemedText>Feed</ThemedText>
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