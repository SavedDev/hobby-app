import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser'

import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedCard from '../../components/ui/ThemedCard'
import Spacer from '../../components/layout/Spacer'
import ThemedTextInput from '../../components/forms/ThemedTextInput'

// Mock Data
const NEARBY_USERS = [
  // { id: '1', name: 'Jaden', hobby: 'Pickleball', distance: '0.5 miles' },
  // { id: '2', name: 'Skyler', hobby: 'Gaming', distance: '1.2 miles' },
  // { id: '3', name: 'Vern', hobby: 'Painting', distance: '2.0 miles' },
  // { id: '4', name: 'Cole', hobby: 'Hiking', distance: '2.5 miles' },
  // { id: '5', name: 'Mila', hobby: 'Chess', distance: '3.1 miles' },
]

const RECENT_DMS = [
  // { id: '1', name: 'Jaden', lastMsg: 'See you at the courts!', time: '10m', unread: true },
  // { id: '2', name: 'Skyler', lastMsg: 'That paddle is awesome.', time: '1h', unread: false },
  // { id: '3', name: 'Vern', lastMsg: 'Ready to paint?', time: '3h', unread: false },
  // { id: '4', name: 'Mila', lastMsg: 'Checkmate!', time: '5h', unread: false },
]

const Social = () => {
  const { user } = useUser()
  const router = useRouter()

  // --- Sub-render: Horizontal DM Bubble ---
  const renderDMBubble = ({ item }) => (
    <TouchableOpacity
      style={styles.dmBubbleContainer}
      onPress={() => router.push('/Chat')}
    >
      <View style={styles.dmAvatarCircle}>
        <ThemedText style={styles.avatarLetterSmall}>{item.name.charAt(0)}</ThemedText>
        {item.unread && <View style={styles.unreadPing} />}
      </View>
      <ThemedText numberOfLines={1} style={styles.dmBubbleName}>{item.name}</ThemedText>
    </TouchableOpacity>
  )

  // --- Sub-render: Vertical Nearby Row ---
  const renderNearbyRow = ({ item }) => (
    <TouchableOpacity style={styles.nearbyRowCard}>
      <View style={styles.avatarPlaceholder}>
        <ThemedText style={styles.avatarLetter}>{item.name.charAt(0)}</ThemedText>
        <View style={styles.onlineBadge} />
      </View>
      <View style={styles.nearbyInfo}>
        <ThemedText style={styles.userName}>{item.name}</ThemedText>
        <ThemedText style={styles.userHobby}>{item.hobby}</ThemedText>
      </View>
      <View style={styles.distanceTag}>
        <ThemedText style={styles.distanceText}>{item.distance}</ThemedText>
      </View>
    </TouchableOpacity>
  )

  // --- List Header Component (DMs + Nearby Title) ---
  const ListHeader = () => (
    <View style={styles.headerComponent}>
      <Spacer height={15} />
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Keep Chatting</ThemedText>
      </View>
      <Spacer height={15} />
      <FlatList
        data={RECENT_DMS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `dm-${item.id}`}
        contentContainerStyle={styles.horizontalDmList}
        renderItem={renderDMBubble}
        ListEmptyComponent={() => (
          <ThemedText>No recent DMs</ThemedText>
        )}
      />

      <Spacer height={35} />

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>People Nearby</ThemedText>
        <ThemedText style={styles.distanceFilter}>Within 5 miles</ThemedText>
      </View>
    </View>
  )

  // --- List Footer Component (Invite Card) ---
  const ListFooter = () => (
    <View style={styles.footerComponent}>
      <Spacer height={20} />
      <ThemedCard style={styles.inviteCard}>
        <Ionicons name="people" size={30} color="white" />
        <View style={styles.inviteContent}>
          <ThemedText style={styles.inviteTitle}>Invite Friends</ThemedText>
          <ThemedText style={styles.inviteSub}>Hobbying is better together!</ThemedText>
        </View>
      </ThemedCard>
      <Spacer height={40} />
    </View>
  )

  return (
    <ThemedView safe style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.header}>
          <ThemedText title style={styles.headerTitle}>Social</ThemedText>
          <TouchableOpacity
            style={styles.dmIconButton}
            onPress={() => router.push('/Chat')}
          >
            <Ionicons name="chatbubbles-outline" size={26} color="#007AFF" />
            <View style={styles.badgeCount}>
              <ThemedText style={styles.badgeText}>39</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        {/* Why have a search bar in social? */}
        {/* <ThemedTextInput
          icon={<Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />}
          inputContainerStyle={styles.searchBarContainer}
          inputStyle={styles.searchInput}
          // value={searchQuery}
          // onChangeText={setSearchQuery}
          placeholder='Search your groups...'
          clearButtonMode="while-editing"
        /> */}
      </View>

      {/* Main Social Feed */}
      <FlatList
        data={NEARBY_USERS}
        keyExtractor={(item) => `nearby-${item.id}`}
        renderItem={renderNearbyRow}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={() => (
          <ThemedText style={{ textAlign: 'center' }}>No people nearby</ThemedText>
        )}
      />
    </ThemedView>
  )
}

export default Social

const styles = StyleSheet.create({
  container: { flex: 1 },
  listPadding: { paddingBottom: 20 },
  stickyHeader: {
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  dmIconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,122,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCount: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Component Sections
  headerComponent: { marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 5
  },
  distanceFilter: { fontSize: 12, color: '#007AFF', fontWeight: '600' },

  // Horizontal DM Bubbles
  horizontalDmList: { paddingLeft: 20, gap: 18 },
  dmBubbleContainer: { alignItems: 'center', width: 62 },
  dmAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,122,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.15)'
  },
  avatarLetterSmall: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  unreadPing: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFF'
  },
  dmBubbleName: { fontSize: 11, fontWeight: '600', opacity: 0.7 },

  // Vertical Nearby Rows
  nearbyRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  avatarPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 20, fontWeight: 'bold', color: '#666' },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: 'white',
  },
  nearbyInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '700' },
  userHobby: { fontSize: 13, opacity: 0.5, marginTop: 2 },
  distanceTag: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
  },
  distanceText: { fontSize: 11, fontWeight: '700', opacity: 0.6 },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginHorizontal: 20
  },

  // Footer Card
  footerComponent: { paddingHorizontal: 20 },
  inviteCard: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  inviteContent: { marginLeft: 15 },
  inviteTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  inviteSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
})