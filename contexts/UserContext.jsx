import { createContext, useEffect, useState } from 'react'
import { account, tablesDB, databaseId, userTable } from '../lib/appwrite'
import { ID, Query } from 'react-native-appwrite'
import { uploadProfilePhoto } from '../helpers/uploadServices'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(true)

  async function login(email, password, isRegistering = false) {
    try {
      await account.createEmailPasswordSession({ email, password })
      const authUser = await account.get()

      if (isRegistering) {
        setUser(authUser)
        return
      }

      const userProfile = await getUserById(authUser.$id)
      setUser(userProfile)
    } catch (error) {
      throw Error(error.message)
    }
  }

  async function register(email, password) {
    try {
      const newUser = await account.create({
        userId: ID.unique(),
        email,
        password
      })
      await login(email, password, true)
      await createProfile(newUser.$id, email)
    } catch (error) {
      throw Error(error.message)
    }
  }

  async function createProfile(id, email) {
    try {
      await tablesDB.createRow({
        databaseId,
        tableId: userTable,
        rowId: id,
        data: {
          email: email,
        }
      })
    } catch (error) {
      throw Error(error.message)
    }
  }

  async function updateUser(data) {
    try {
      const response = await tablesDB.updateRow({
        databaseId,
        tableId: userTable,
        rowId: user.$id,
        data
      })
      setUser(response)
    } catch (error) {
      throw Error(error.message)
    }
  }

  async function getUserById(userId) {
    try {
      const response = await tablesDB.getRow({
        databaseId,
        tableId: userTable,
        rowId: userId,
        queries: [
          Query.select(['*', 'joinedHobbyGroups.name']),
        ],
      })

      return response
    } catch (error) {
      console.error('Failed to fetch user by ID:', error.message)
      return null
    }
  }

  async function logout() {
    await account.deleteSession({ sessionId: 'current' })
    setUser(null)
  }

  async function deleteAccount() {
    try {
      await account.updateStatus()
      setUser(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  // Inside your useUser hook/context
  const updateUserPhoto = async (userId) => {
    try {
      // 1. Call the service we just fixed
      const fileId = await uploadProfilePhoto(userId)

      if (fileId) {
        // 2. Update the document in Appwrite
        await tablesDB.updateRow({
          databaseId: databaseId,
          tableId: userTable,
          rowId: userId,
          data: {
            profileImage: fileId, // This matches your new String attribute
          },
        })

        // 3. Update the global state so Profile.jsx re-renders immediately
        setUser((prev) => ({
          ...prev,
          profileImage: fileId,
        }))

        return fileId
      }
    } catch (error) {
      console.error("Hook Error:", error)
      throw error
    }
  }

  useEffect(() => {
    async function getUser() {
      try {
        const authUser = await account.get()
        const userProfile = await getUserById(authUser.$id)
        setUser(userProfile)
      } catch {
        setUser(null)
      } finally {
        setAuthChecked(true)
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, login, register, updateUser, logout, deleteAccount, authChecked, loading, updateUserPhoto }}>
      {children}
    </UserContext.Provider>
  )
}