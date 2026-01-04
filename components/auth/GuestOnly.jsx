import { useEffect } from "react"
import { useRouter } from "expo-router"

import { useUser } from "../../hooks/useUser"

import ThemedLoader from "../ui/ThemedLoader"

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (authChecked && user) {
      if (!user.username) {
        router.replace("/Username")
        return
      }
      router.replace("/Profile")
    }
  }, [authChecked, user])

  if (!authChecked || (user && user.username)) {
    return (
      <ThemedLoader />
    )
  }

  return children
}

export default GuestOnly