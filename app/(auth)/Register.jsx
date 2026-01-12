import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { useContext, useState } from 'react'
import { Link } from 'expo-router'

import { UserContext } from '../../contexts/UserContext'
import { Colors } from '../../constants/colors'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import ThemedTextInput from '../../components/forms/ThemedTextInput'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { register } = useContext(UserContext)

  const handleSubmit = async () => {
    setError(null)
    try {
      await register(email, password)
    } catch (error) {
      setError(error.message)
      console.log(error.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title >Register an account</ThemedText>

        <Spacer height={20} />

        <ThemedTextInput
          width={300}
          title='Email'
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Spacer height={10} />

        <ThemedTextInput
          width={300}
          title='Password'
          placeholder='Password'
          secureTextEntry
          autoCapitalize='none'
          autoComplete='password'
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <Spacer height={10} />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Spacer height={20} />

        <ThemedButton onPress={handleSubmit} title='Register' />

        <Spacer height={20} />

        <Link href="/Login">
          <ThemedText>Login</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Register

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