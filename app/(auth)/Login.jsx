import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'expo-router'
import { useContext, useState } from 'react'

import { UserContext } from '../../contexts/UserContext'
import { Colors } from '../../constants/colors'

import Spacer from '../../components/layout/Spacer'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import ThemedTextInput from '../../components/forms/ThemedTextInput'
import ThemedView from '../../components/layout/ThemedView'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { login } = useContext(UserContext)

  const handleSubmit = async () => {
    setError(null)
    try {
      await login(email, password)
    } catch (error) {
      setError(error.message)
      console.log(error.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title >Login</ThemedText>

        <Spacer height={20} />

        <ThemedTextInput
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
          title='Password'
          placeholder='Password'
          secureTextEntry
          showPasswordEye={false}
          autoCapitalize='none'
          autoComplete='password'
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <Spacer height={10} />
        <ThemedText>Forgot Password?</ThemedText>

        <Spacer height={20} />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Spacer height={20} />

        <ThemedButton onPress={handleSubmit} title='Login' />

        <Spacer height={20} />

        <Link href="/Register">
          <ThemedText>Register</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Login

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