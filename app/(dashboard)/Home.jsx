import { useState, useMemo } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useGroups } from '../../hooks/useGroups'
import { useUser } from '../../hooks/useUser'

import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedCard from '../../components/ui/ThemedCard'
import Spacer from '../../components/layout/Spacer'
import ThemedTextInput from '../../components/forms/ThemedTextInput'

const Home = () => {
  const { groups } = useGroups()
  const { user } = useUser()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')

  // --- Search Logic ---
  // We use useMemo to filter groups only when searchQuery or groups change
  const myGroups = user?.joinedHobbyGroups || []

  const filteredMyGroups = useMemo(() => {
    return myGroups.filter(g =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, myGroups])

  const renderActivityItem = ({ item }) => (
    <ThemedCard style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.dot} />
        <ThemedText style={styles.activityGroup}>{item.name}</ThemedText>
      </View>
      <Spacer height={8} />
      <ThemedText numberOfLines={2} style={styles.activityText}>
        New discussion: "Best spots for {item.subcategory || 'the weekend'}?"
      </ThemedText>
      <Spacer height={10} />
      <ThemedText style={styles.timeText}>2m ago</ThemedText>
    </ThemedCard>
  )

  return (
    <ThemedView safe style={styles.container}>
      {/* --- Fixed Header --- */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.greeting}>Hello, {user?.username || 'Hobbyist'}</ThemedText>
            <ThemedText title style={styles.title}>Your Dashboard</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(dashboard)/Profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <Spacer height={15} />

        {/* --- Search Bar --- */}
        <ThemedTextInput
          icon={<Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />}
          inputStyle={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search your groups...'
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* --- Stats --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{myGroups.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Joined</ThemedText>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>{groups.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Discover</ThemedText>
          </View>
        </View>

        <Spacer height={30} />

        {/* --- Quick Access (Filtered) --- */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Quick Access'}
          </ThemedText>
        </View>

        <FlatList
          data={filteredMyGroups}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `home-my-${item.$id}`}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'No matching groups' : 'Join a group to see it here!'}
            </ThemedText>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/groups/${item.$id}`)}
              style={styles.shortcut}
            >
              <View style={styles.shortcutIcon}>
                <ThemedText style={styles.shortcutLetter}>{item.name.charAt(0)}</ThemedText>
              </View>
              <ThemedText numberOfLines={1} style={styles.shortcutText}>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />

        <Spacer height={30} />

        {/* --- Recent Activity --- */}
        {!searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            </View>
            <FlatList
              data={myGroups.slice(0, 3)}
              scrollEnabled={false}
              keyExtractor={(item) => `activity-${item.$id}`}
              renderItem={renderActivityItem}
            />
          </>
        )}
      </ScrollView>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 16, opacity: 0.6 },
  title: { fontSize: 28, fontWeight: '800' },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.05)',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    color: '#000', // You should ideally use theme.text here
  },
  scrollContent: { paddingBottom: 40 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-around',
    elevation: 4,
  },
  statBox: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: 'white', fontSize: 12, opacity: 0.8 },
  verticalDivider: { width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15, alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  horizontalList: { paddingLeft: 20, paddingRight: 10, gap: 15 },
  shortcut: { alignItems: 'center', width: 80 },
  shortcutIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortcutLetter: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  shortcutText: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  activityCard: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 16 },
  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759' },
  activityGroup: { fontSize: 14, fontWeight: '700', opacity: 0.8 },
  activityText: { fontSize: 15, lineHeight: 20 },
  timeText: { fontSize: 12, opacity: 0.4 },
  emptyText: { opacity: 0.5, textAlign: 'center', marginTop: 10, width: '100%' },
})