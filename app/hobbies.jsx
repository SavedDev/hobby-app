import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

import Spacer from '../components/layout/Spacer'
import ThemedView from '../components/layout/ThemedView'
import ThemedText from '../components/ui/ThemedText'

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