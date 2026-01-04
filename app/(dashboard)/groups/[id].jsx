import { StyleSheet } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'

import { useGroups } from '../../../hooks/useGroups'
import { useUser } from '../../../hooks/useUser'

import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedLoader from '../../../components/ui/ThemedLoader'
import ThemedButton from '../../../components/ui/ThemedButton'
import Spacer from '../../../components/layout/Spacer'

const GroupDetails = () => {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [handleMembershipLoading, setHandleMembershipLoading] = useState(false)

  const [existingGroupIds, setExistingGroupIds] = useState([])
  const [isMember, setIsMember] = useState(false)
  const [userIsAuthor, setUserIsAuthor] = useState(false)

  const { fetchGroupById, deleteGroup, toggleGroupMembership } = useGroups()
  const { user } = useUser()

  const { id, name } = useLocalSearchParams()
  const navigation = useNavigation()

  const handleDeleteGroup = async () => {
    setHandleMembershipLoading(true)
    await deleteGroup(id, getUpdatedGroupIds())
    setGroup(null)
    setHandleMembershipLoading(false)
    navigation.goBack()
  }

  const handleJoinGroup = async () => {
    setHandleMembershipLoading(true)
    await toggleGroupMembership(getUpdatedGroupIds())
    setHandleMembershipLoading(false)
    navigation.goBack()
  }

  const getUpdatedGroupIds = (groupId = id) => {
    let updatedGroupIds
    if (isMember) {
      // leave group
      return updatedGroupIds = existingGroupIds.filter(id => id !== groupId)
    } else {
      // join group
      return updatedGroupIds = [groupId, ...existingGroupIds]
    }
  }

  useEffect(() => {
    setLoading(true)

    async function loadGroup() {
      const groupData = await fetchGroupById(id)
      setGroup(groupData)
      setLoading(false)
    }
    loadGroup()
  }, [id])

  useEffect(() => {
    setExistingGroupIds(user.joinedHobbyGroups?.map(g => g.$id || g) || [])
    setIsMember(existingGroupIds.includes(id))
    setUserIsAuthor(group?.author === user.$id)

  }, [group])

  useEffect(() => {
    if (group?.name) {
      navigation.setOptions({ title: name })
    }
  }, [group, navigation])

  if (!group || loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container} safe={false}>
      <ThemedText title>{group?.name}</ThemedText>

      {userIsAuthor &&
        <ThemedButton
          onPress={handleDeleteGroup}
          loading={handleMembershipLoading}
          title='Delete Group' />
      }
      <Spacer />
      <ThemedButton
        onPress={handleJoinGroup}
        title={isMember ? 'Leave Group' : 'Join Group'}
        loading={handleMembershipLoading}
      />
    </ThemedView>
  )
}

export default GroupDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
})