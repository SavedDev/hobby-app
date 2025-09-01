import { createContext, useEffect, useState } from 'react'
import { tablesDB, client } from '../lib/appwrite'
import { ID, Permission, Query, Role } from 'react-native-appwrite'

import { useUser } from '../hooks/useUser'

export const GroupContext = createContext()

const databaseId = '68ab626a00016c1fae96'
const tableId = '68ab634f003de5b45029'

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([])
  const { user } = useUser()

  async function fetchGroups() {
    try {
      const response = await tablesDB.listRows({
        databaseId,
        tableId,
        queries: [
          Query.select(['*', 'author.*']),
          Query.orderDesc('$createdAt'),
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
        tableId,
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
        tableId,
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

  async function deleteGroup(groupId) {
    try {
      await tablesDB.deleteRow({
        databaseId,
        tableId,
        rowId: groupId
      })
    } catch (error) {
      console.error('Failed to delete group:', error)
    }
  }

  useEffect(() => {
    let unsubscribe
    const channel = `databases.${databaseId}.tables.${tableId}.rows`

    if (user) {
      fetchGroups()

      unsubscribe = client.subscribe(channel, (res) => {
        const { payload, events } = res

        if (events[0].includes('create')) {
          setGroups((prevGroups) => [payload, ...prevGroups])
        }

        if (events[0].includes('delete')) {
          setGroups((prevGroups) => prevGroups.filter((group) => group.$id !== payload.$id))
        }
      })
    } else {
      setGroups([])
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }

  }, [user])

  return (
    <GroupContext.Provider value={{ groups, fetchGroups, fetchGroupById, createNewGroup, updateGroup, deleteGroup }}>
      {children}
    </GroupContext.Provider>
  )
}