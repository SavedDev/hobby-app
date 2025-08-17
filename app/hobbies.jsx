import { Link } from 'expo-router'
import { SectionList, StyleSheet } from 'react-native'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'

const Hobbies = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title >Hobbies</ThemedText>
      <Spacer />

      {/* <SectionList>#1</SectionList>
      <SectionList>#2</SectionList>
      <SectionList>#3</SectionList>
      <SectionList>#4</SectionList> */}

      <Link href="/">
        <ThemedText>Home</ThemedText>
      </Link>
    </ThemedView>
  )
}

export default Hobbies

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})