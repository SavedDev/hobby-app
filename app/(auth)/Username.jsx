import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useContext, useState } from 'react'
import { router } from 'expo-router'

import { UserContext } from '../../contexts/UserContext'
import { Colors } from '../../constants/colors'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import ThemedTextInput from '../../components/forms/ThemedTextInput'

const Username = () => {
  const [username, setUsername] = useState(null)
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)

  const handleSubmit = async () => {
    setError(null)
    try {
      await updateUser({ username })
      router.replace('/(dashboard)/Profile')
    } catch (error) {
      setError(error.message)
      console.log(error.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title >Create Username</ThemedText>

        <Spacer height={20} />

        <ThemedTextInput
          title='Username'
          placeholder='Username'
          autoComplete='username'
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
        <Spacer height={10} />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Spacer height={20} />

        <ThemedButton onPress={handleSubmit} title='Next' />
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Username

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: Colors.warning,
    width: '80%',
    backgroundColor: '#f5c1c8',
    padding: 10,
    borderRadius: 5,
  },
})