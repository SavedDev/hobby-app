import { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { Link } from 'expo-router'
import { viewUserProfileUrl } from '../../helpers/previewFileURL'
import { Ionicons } from '@expo/vector-icons'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import ThemedModalScreen from '../../components/ui/ThemedModalScreen'
import CustomTouchableOpacity from '../../components/ui/CustomTouchableOpacity'

const Profile = () => {
  const { logout, deleteAccount, user, updateUserPhoto } = useUser()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const myGroups = user?.joinedHobbyGroups || []

  const handleUpdatePhoto = async () => {
    try {
      setLoading(true)
      await updateUserPhoto(user?.$id)
    } catch (error) {
      console.error('Failed to update photo:', error)
    } finally {
      setLoading(false)
    }
  }

  const profileUri = viewUserProfileUrl(user?.profileImage)

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        {/* menu */}
        <ThemedModalScreen
          openEl={<Ionicons style={{ top: 10 }} name="menu-sharp" size={35} />}
          menuOpen={menuOpen}
          setCloseModal={setMenuOpen}
        >
          {/* --- Menu options --- */}
          <View style={styles.menuContainer}>
            <ThemedButton onPress={logout} title='Logout' variant="secondary" />
            <Spacer height={20} />
            <CustomTouchableOpacity onPress={deleteAccount}>
              <ThemedText style={styles.deleteText}>Delete Account</ThemedText>
            </CustomTouchableOpacity>
          </View>
        </ThemedModalScreen>
      </View>

      {/* --- Profile Section --- */}
      <View style={styles.profile}>
        {/* avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            {profileUri ? (
              <Image
                source={{ uri: profileUri }}
                style={styles.avatarImage}
                // key forces the image to refresh if the URI changes
                key={profileUri}
              />
            ) : (
              <ThemedText style={styles.placeholderEmoji}>👤</ThemedText>
            )}

            {/* Loading Overlay */}
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>

          <CustomTouchableOpacity
            style={styles.editBadge}
            onPress={handleUpdatePhoto}
            disabled={loading}
          >
            <ThemedText style={styles.editIcon}>{loading ? '...' : '✎'}</ThemedText>
          </CustomTouchableOpacity>
        </View>

        <Spacer height={15} />

        <ThemedText title style={styles.userName}>
          {user?.username || 'New Hobbyist'}
        </ThemedText>
        <ThemedText style={styles.emailText}>{user?.email}</ThemedText>

        <Spacer height={20} />

        <ThemedText title>
          Interests:
        </ThemedText>

        <View style={styles.interestsContainer}>
          {user?.interests?.map((interest, index) => (
            <ThemedText key={index} style={styles.interestText}>
              {interest}
            </ThemedText>
          ))}
        </View>

        {!user?.username && (
          <Link href="/Username" style={{ marginTop: 12 }}>
            <ThemedText style={styles.linkText}>Set your username →</ThemedText>
          </Link>
        )}
      </View>

      <Spacer height={30} />

      {/* --- Stats Grid --- */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>{myGroups.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Groups Joined</ThemedText>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.statBox}>
          <ThemedText style={styles.statNumber}>0</ThemedText>
          <ThemedText style={styles.statLabel}>Hobby XP</ThemedText>
        </View>
      </View>

      <Spacer height={40} />
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row', // removes full width
    // top: 8,
    // backgroundColor: 'red'
  },
  profile: {
    alignItems: 'center',
    marginTop: 10
    // backgroundColor: 'blue'
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
    overflow: 'hidden', // clips image to circle
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderEmoji: {
    fontSize: 50,
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  editIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
  },
  emailText: {
    opacity: 0.5,
    fontSize: 14,
    marginTop: 2
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 15
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingVertical: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#007AFF'
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.5,
    marginTop: 2
  },
  menuContainer: {
    // width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
  deleteText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
})