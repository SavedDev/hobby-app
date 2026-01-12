import { FlatList, Pressable, StyleSheet, View, Dimensions } from 'react-native'
import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useGroups } from '../../../hooks/useGroups'
import { useUser } from '../../../hooks/useUser'

import CreateGroup from './CreateGroup'
import Spacer from '../../../components/layout/Spacer'
import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedCard from '../../../components/ui/ThemedCard'
import ThemedModal from '../../../components/ui/ThemedModal'
import ThemedTextInput from '../../../components/forms/ThemedTextInput'

const { width } = Dimensions.get('window')
const COLUMN_WIDTH = (width - 52) / 2 // Accounts for gap and padding

const Groups = () => {
  const [closeModal, setCloseModal] = useState(false)
  const { groups } = useGroups()
  const { user } = useUser()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter groups the user has joined
  const myGroups = user?.joinedHobbyGroups || []

  // Perfectionist Logic: Generate consistent UI colors based on string length/char
  const getGroupColor = (name) => {
    const colors = ['#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#FF9500', '#34C759']
    const index = name?.length % colors.length || 0
    return colors[index]
  }

  // 1. Horizontal Render: "My Hobbies" Cards
  const renderMyGroupCard = useCallback(({ item }) => (
    <Pressable
      onPress={() => router.push({ pathname: `/groups/${item.$id}`, params: { name: item.name } })}
      style={styles.myGroupCardWrapper}
    >
      <ThemedCard style={styles.myGroupCard}>
        <View style={[styles.cardAccent, { backgroundColor: getGroupColor(item.name) }]} />
        <View style={styles.myCardContent}>
          <ThemedText numberOfLines={2} style={styles.myGroupTitle}>
            {item.name}
          </ThemedText>

          <View style={styles.myCardFooter}>
            <View style={[styles.miniDot, { backgroundColor: getGroupColor(item.name) }]} />
            <ThemedText style={styles.activeText}>Active Now</ThemedText>
          </View>
        </View>
      </ThemedCard>
    </Pressable>
  ), [router])

  // 2. Grid Render: "Trending Now" Cards
  const renderDiscoveryCard = useCallback(({ item }) => (
    <Pressable
      onPress={() => router.push({ pathname: `/groups/${item.$id}`, params: { name: item.name } })}
      style={styles.gridCardWrapper}
    >
      <ThemedCard style={styles.gridCard}>
        <View style={[styles.cardAccent, { backgroundColor: getGroupColor(item.name) }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.categoryText}>{item.category || 'Hobby'}</ThemedText>
          </View>
          <View>
            <ThemedText numberOfLines={2} style={styles.gridTitle}>{item.name}</ThemedText>
            <Spacer height={4} />
            <ThemedText style={styles.memberCount}>@{item.author?.username || 'user'}</ThemedText>
          </View>
        </View>
      </ThemedCard>
    </Pressable>
  ), [router])

  return (
    <ThemedView safe style={styles.container}>
      {/* Top Navigation & Search */}
      <View style={styles.topBar}>
        <View style={styles.header}>
          <View>
            <ThemedText title style={styles.welcomeText}>Explore</ThemedText>
            <ThemedText style={styles.dateText}>Find your next community</ThemedText>
          </View>
          <ThemedModal
            buttonTitle="+"
            closeModal={closeModal}
            setCloseModal={setCloseModal}
            style={styles.plusButton}
          >
            <CreateGroup setCloseModal={setCloseModal} />
          </ThemedModal>
        </View>
        <Spacer height={15} />
        <ThemedTextInput
          icon={<Ionicons name="search" size={20} color="#999" />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search hobbies...'
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        renderItem={renderDiscoveryCard}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <ThemedText style={styles.sectionTitle}>My Hobbies</ThemedText>
            <FlatList
              data={myGroups}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `my-card-${item.$id}`}
              renderItem={renderMyGroupCard}
              contentContainerStyle={styles.myGroupsHorizontalList}
              ListEmptyComponent={
                <ThemedText style={styles.emptyText}>Join a group to get started</ThemedText>
              }
            />
            <Spacer height={30} />
            <ThemedText style={styles.sectionTitle}>Trending Now</ThemedText>
          </View>
        }
      />
    </ThemedView>
  )
}

export default Groups

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcomeText: { fontSize: 32, fontWeight: '800' },
  dateText: { opacity: 0.5, fontSize: 14, fontWeight: '500' },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 15
  },

  // --- MY HOBBIES (HORIZONTAL) ---
  myGroupsHorizontalList: {
    paddingLeft: 20,
    gap: 12,
    paddingBottom: 5
  },
  myGroupCardWrapper: { width: 150 },
  myGroupCard: {
    height: 110,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  myCardContent: {
    flex: 1,
    padding: 5,
    justifyContent: 'space-between',
  },
  myGroupTitle: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  myCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  activeText: { fontSize: 10, fontWeight: '600', opacity: 0.4 },

  // --- TRENDING NOW (GRID) ---
  scrollContent: { paddingBottom: 100 },
  columnWrapper: {
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  gridCardWrapper: {
    marginBottom: 12,
    width: COLUMN_WIDTH
  },
  gridCard: {
    height: 150,
    paddingHorizontal: 12,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardAccent: { height: 5, width: '100%' },
  cardContent: {
    flex: 1,
    padding: 5,
    justifyContent: 'space-between'
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    opacity: 0.4,
    letterSpacing: 0.5
  },
  gridTitle: { fontSize: 15, fontWeight: '800', lineHeight: 21 },
  memberCount: { fontSize: 11, fontWeight: '600', color: '#007AFF', opacity: 0.8 },
  emptyText: { opacity: 0.4, fontSize: 13, marginLeft: 20, fontStyle: 'italic' },
})