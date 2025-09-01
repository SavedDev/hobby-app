import { StyleSheet } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'

import { useGroups } from '../../../hooks/useGroups'

import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedLoader from '../../../components/ui/ThemedLoader'
import ThemedButton from '../../../components/ui/ThemedButton'

const GroupDetails = () => {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(false)

  const { fetchGroupById, deleteGroup } = useGroups()

  const { id, name } = useLocalSearchParams()
  const navigation = useNavigation()

  const handleDeleteGroup = async () => {
    await deleteGroup(group.$id)
    setGroup(null)
    navigation.goBack()
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

      <ThemedButton onPress={handleDeleteGroup} title='Delete Group' />
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