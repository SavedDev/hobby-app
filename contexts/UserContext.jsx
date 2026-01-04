import { createContext, useEffect, useState } from 'react'
import { account, tablesDB, databaseId, userTable } from '../lib/appwrite'
import { ID, Query } from 'react-native-appwrite'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

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
      }
    }

    getUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, login, register, updateUser, logout, deleteAccount, authChecked }}>
      {children}
    </UserContext.Provider>
  )
}