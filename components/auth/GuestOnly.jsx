import { useEffect } from "react"
import { useRouter } from "expo-router"

import { useUser } from "../../hooks/useUser"

import ThemedLoader from "../ui/ThemedLoader"

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/(dashboard)/Profile")
    }
  }, [authChecked, user])

  if (!authChecked || user) {
    return (
      <ThemedLoader />
    )
  }

  return children
}

export default GuestOnly