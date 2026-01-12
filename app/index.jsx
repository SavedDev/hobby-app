import { Redirect } from 'expo-router'
import { useUser } from '../hooks/useUser'
import ThemedLoader from '../components/ui/ThemedLoader'

const Index = () => {
  const { user, loading } = useUser()

  if (loading) {
    return <ThemedLoader />
  }

  if (!user) {
    return <Redirect href="/(auth)/Login" />
  }

  return <Redirect href="/(dashboard)/Home" />
}

export default Index