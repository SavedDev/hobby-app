import { StyleSheet } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'

import { useGroups } from '../../../hooks/useGroups'
import { useUser } from '../../../hooks/useUser'

import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedLoader from '../../../components/ui/ThemedLoader'
import ThemedButton from '../../../components/ui/ThemedButton'
import Spacer from '../../../components/layout/Spacer'

const GroupDetails = () => {
  const { id, name } = useLocalSearchParams()
  const navigation = useNavigation()

  const { fetchGroupById, deleteGroup, toggleGroupMembership } = useGroups()
  const { user } = useUser()

  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // We calculate these constants every render so they are ALWAYS in sync with 'user' and 'group'
  const joinedGroupIds = useMemo(() => user?.joinedHobbyGroups?.map(g => g.$id || g) || [], [user])
  const isMember = joinedGroupIds.includes(id)
  const isAuthor = group?.author === user?.$id

  useEffect(() => {
    async function loadGroup() {
      setLoading(true)
      const groupData = await fetchGroupById(id, ['author'])
      setGroup(groupData)
      setLoading(false)
    }
    loadGroup()
  }, [id])

  // navigation title
  useEffect(() => {
    if (group?.name) {
      navigation.setOptions({ title: group.name })
    }
  }, [group])

  const handleToggleMembership = async () => {
    setActionLoading(true)
    await toggleGroupMembership(id)
    setActionLoading(false)
  }

  const handleDelete = async () => {
    setActionLoading(true)
    const updatedIds = joinedGroupIds.filter(groupId => groupId !== id)
    await deleteGroup(id, updatedIds)
    setActionLoading(false)

    navigation.goBack()
  }

  if (loading || !group) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container} safe={false}>
      <ThemedView style={styles.content}>
        <ThemedText title>{group.name}</ThemedText>
        <ThemedText style={styles.subtitle}>{group.description || 'No description provided.'}</ThemedText>
        <ThemedText style={styles.subtitle}>{group.author?.username + ' created this group'}</ThemedText>

        <Spacer height={40} />

        <ThemedButton
          onPress={handleToggleMembership}
          title={isMember ? 'Leave Group' : 'Join Group'}
          loading={actionLoading}
          variant={isMember ? 'secondary' : 'primary'} // Visual cue for state
        />

        {isAuthor && (
          <>
            <Spacer height={12} />
            <ThemedButton
              onPress={handleDelete}
              loading={actionLoading}
              title='Delete Group'
              style={{ backgroundColor: '#FF3B30' }} // Standard destructive red
            />
          </>
        )}
      </ThemedView>
    </ThemedView>
  )
}

export default GroupDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'stretch',
  },
  subtitle: {
    opacity: 0.6,
    marginTop: 8,
  }
})