import { FlatList, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

import { useGroups } from '../../../hooks/useGroups'
import { useUser } from '../../../hooks/useUser'

import CreateGroup from './CreateGroup'
import Spacer from '../../../components/layout/Spacer'
import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedCard from '../../../components/ui/ThemedCard'
import ThemedModal from '../../../components/ui/ThemedModal'

const Groups = () => {
  const [closeModal, setCloseModal] = useState(false)

  const { groups } = useGroups()
  const { user } = useUser()

  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <ThemedModal buttonTitle="Create New Group" closeModal={closeModal} setCloseModal={setCloseModal}>
        <CreateGroup setCloseModal={setCloseModal} />
      </ThemedModal>

      {/* my groups */}
      <ThemedText title>My Groups</ThemedText>
      <FlatList
        data={user.joinedHobbyGroups}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        style={{ flexGrow: 0 }}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/groups/${item.$id}`,
                params: { name: item.name }
              })
            }
          >
            <ThemedCard style={{ marginBottom: 10 }}>
              <ThemedText title>{'Created by: ' + item.author?.username}</ThemedText>
              <Spacer />
              <ThemedText style={{ fontWeight: 'bold', fontSize: 20 }} title>{item.name}</ThemedText>
              <ThemedText title>{item.description}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />

      <Spacer height={20} />

      {/* all groups */}
      <ThemedText title style={{ marginBottom: 10 }}>All Groups</ThemedText>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        style={{ flexGrow: 0 }}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: `/groups/${item.$id}`,
                params: { name: item.name }
              })
            }
          >
            <ThemedCard style={{ marginBottom: 10 }}>
              <ThemedText title>{'Created by: ' + item.author?.username}</ThemedText>
              <Spacer />
              <ThemedText style={{ fontWeight: 'bold', fontSize: 20 }} title>{item.name}</ThemedText>
              <ThemedText title>{item.description}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />
    </ThemedView>
  )
}

export default Groups

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    // justifyContent: 'center',
  },
  list: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
})