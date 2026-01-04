import { createContext, useEffect, useState } from 'react'
import { tablesDB, client, databaseId, groupTable, userTable } from '../lib/appwrite'
import { ID, Permission, Query, Role } from 'react-native-appwrite'

import { useUser } from '../hooks/useUser'

export const GroupContext = createContext()

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([])
  const { user, setUser } = useUser()

  async function fetchGroups(relations = []) {
    try {
      let selectFields = ['*']

      relations.forEach(rel => {
        selectFields.push(`${rel}.*`)
      })
      const response = await tablesDB.listRows({
        databaseId,
        tableId: groupTable,
        queries: [
          Query.select(selectFields),
          Query.orderDesc('$createdAt')
        ],
      })
      setGroups(response.rows)
    } catch (error) {
      console.error('Failed to fetch groups:', error)
    }
  }

  async function fetchGroupById(groupId) {
    try {
      const response = await tablesDB.getRow({
        databaseId,
        tableId: groupTable,
        rowId: groupId
      })
      return response
    } catch (error) {
      console.error('Failed to fetch group by ID:', error)
      return null
    }
  }

  async function createNewGroup(groupData) {
    try {
      const newGroup = await tablesDB.createRow({
        databaseId,
        tableId: groupTable,
        rowId: ID.unique(),
        data: {
          ...groupData,
          author: user.$id,
        },
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      })
    } catch (error) {
      console.error('Failed to create group:', error)
    }
  }

  async function updateGroup(groupId, groupData) {
    try {
      const updatedGroup = null
      return updatedGroup
    } catch (error) {
      console.error('Failed to update group:', error)
      return null
    }
  }

  async function toggleGroupMembership(groupIds) {
    try {
      const response = await tablesDB.updateRow({
        databaseId,
        tableId: userTable,
        rowId: user.$id,
        data: {
          joinedHobbyGroups: groupIds,
        },
      })

      setUser(response)
      return response
    } catch (error) {
      console.error('Failed to toggle group membership:', error.message)
      return null
    }
  }

  async function deleteGroup(groupId) {
    try {
      await tablesDB.deleteRow({
        databaseId,
        tableId: groupTable,
        rowId: groupId
      })
    } catch (error) {
      console.error('Failed to delete group:', error)
    }
  }

  useEffect(() => {
    let unsubGroup
    let unsubUser

    if (user) {
      fetchGroups()

      // subscribe to groups
      unsubGroup = client.subscribe(
        `databases.${databaseId}.tables.${groupTable}.rows`,
        (res) => {
          const { payload, events } = res

          if (events[0].includes("create")) {
            setGroups((prevGroups) => [payload, ...prevGroups])
          }

          if (events[0].includes("delete")) {
            setGroups((prevGroups) =>
              prevGroups.filter((group) => group.$id !== payload.$id)
            )
          }
        }
      )

      // subscribe to this user
      unsubUser = client.subscribe(
        `databases.${databaseId}.tables.${userTable}.rows.${user.$id}`,
        (res) => {
          const { events } = res

          if (events[0].includes("update")) {
            // refresh groups when user data changes
            fetchGroups()
          }
        }
      )
    } else {
      setGroups([])
    }

    return () => {
      if (unsubGroup) unsubGroup()
      if (unsubUser) unsubUser()
    }
  }, [user])


  return (
    <GroupContext.Provider value={{ groups, fetchGroups, fetchGroupById, createNewGroup, updateGroup, toggleGroupMembership, deleteGroup }}>
      {children}
    </GroupContext.Provider>
  )
}