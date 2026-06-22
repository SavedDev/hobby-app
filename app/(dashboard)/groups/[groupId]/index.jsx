import { Image, StyleSheet, View, Dimensions, useColorScheme, Platform, Animated } from 'react-native'
import { useLocalSearchParams, useNavigation, router } from 'expo-router'
import { useEffect, useState, useMemo, useRef } from 'react'
import { AntDesign } from '@expo/vector-icons'

import { useUser } from '../../../../hooks/useUser'
import { useGroups } from '../../../../hooks/useGroups'
import { Colors } from '../../../../constants/colors'
import { viewUserProfileUrl } from '../../../../helpers/previewFileURL'

import ThemedView from '../../../../components/layout/ThemedView'
import ThemedText from '../../../../components/ui/ThemedText'
import ThemedLoader from '../../../../components/ui/ThemedLoader'
import ThemedButton from '../../../../components/ui/ThemedButton'
import Spacer from '../../../../components/layout/Spacer'
import CustomTouchableOpacity from '../../../../components/ui/CustomTouchableOpacity'
import ThemedOptionsMenu from '../../../../components/ui/ThemedOptionsMenu'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const GroupDetails = () => {
  const { groupId: id, refresh } = useLocalSearchParams()
  const navigation = useNavigation()
  const { fetchGroupById, deleteGroup, toggleGroupMembership } = useGroups()
  const { user } = useUser()

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const [group, setGroup] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(350)

  const scrollY = useRef(new Animated.Value(0)).current

  const joinedGroupIds = useMemo(() => user?.joinedHobbyGroups?.map(g => g.$id || g) || [], [user])
  const isMember = joinedGroupIds.includes(id)
  const isAuthor = group?.author?.$id === user?.$id
  const profileUri = viewUserProfileUrl(group?.groupImage)

  const loadGroup = async () => {
    const groupData = await fetchGroupById(id, ['author', 'members'])
    setGroup(groupData)
    router.setParams({ refresh: false })
  }

  useEffect(() => {
    loadGroup()
  }, [id, refresh])

  useEffect(() => {
    if (profileUri) {
      Image.getSize(profileUri, (width, height) => {
        const scaleFactor = width / SCREEN_WIDTH
        const dynamicHeight = height / scaleFactor
        setHeaderHeight(dynamicHeight)
      })
    }
  }, [profileUri])

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: '#FFF',
    })
  }, [])

  // INTERPOLATIONS
  const imageScale = scrollY.interpolate({
    inputRange: [-headerHeight, 0],
    outputRange: [1.4, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  })

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-1, 0],
    outputRange: [0.2, 0],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  })

  const contentResistance = scrollY.interpolate({
    inputRange: [-1, 0],
    outputRange: [-0.58, 0], // FIGHTS the downward pull
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  })

  const handleToggleMembership = async () => {
    setActionLoading(true)
    await toggleGroupMembership(id)
    setActionLoading(false)
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await deleteGroup(id, group?.groupImage)
      // Go all the way back to the groups list tab
      router.dismissAll()
    } catch (error) {
      Alert.alert("Error", "Could not delete group.")
    } finally {
      setActionLoading(false)
    }
  }

  const groupOptions = [
    { label: "Manage Group", onPress: () => router.push(`/groups/${id}/edit`) },
  ]

  if (!group) return <ThemedView style={styles.loadingCenter}><ThemedLoader /></ThemedView>

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.uiBackground }]}>
      <CustomTouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={23} color="#FFF" />
      </CustomTouchableOpacity>
      <Animated.View
        style={[
          styles.fixedHeroContainer,
          {
            height: headerHeight,
            zIndex: 1,
            transform: [{ translateY: imageTranslateY }, { scale: imageScale }],
          }
        ]}
      >
        {profileUri ? (
          !headerHeight ? (
            <View style={[styles.heroImage, styles.placeholderBg]}>
              <ThemedLoader />
            </View>
          ) :
            <Image source={{ uri: profileUri }} style={styles.heroImage} resizeMode="contain" />
        ) : (
          <View style={[styles.heroImage, styles.placeholderBg]}>
            <ThemedText style={styles.placeholderEmoji}>🏔️</ThemedText>
          </View>
        )}
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        style={{ backgroundColor: 'transparent', zIndex: 2 }}
      >
        {/* RESISTANCE WRAPPER */}
        <Animated.View style={{ transform: [{ translateY: contentResistance }] }}>
          {/* prefer to have the header be the same height no matter what the image height is */}
          <View style={{ height: 250, backgroundColor: 'transparent' }} />
          {/* <View style={{ height: headerHeight - 35, backgroundColor: 'transparent' }} /> */}

          <View style={styles.shadowWrapper}>
            <View style={[styles.contentCard, { backgroundColor: theme.uiBackground }]}>
              {isAuthor && <ThemedOptionsMenu dotsStyles={styles.dots} options={groupOptions} dotsSize={26} />}

              <View style={styles.categoryBadge}>
                <ThemedText style={styles.categoryText}>{group.category || 'General'}</ThemedText>
              </View>

              <ThemedText title style={styles.groupTitle}>{group.name}</ThemedText>

              <CustomTouchableOpacity style={styles.authorRow} activeOpacity={0.8}>
                <View style={styles.avatarMini} />
                <ThemedText style={styles.authorName}>
                  by <ThemedText style={[styles.boldUsername, { color: theme.text }]}>
                    {group.author?.username || 'Unknown'}
                  </ThemedText>
                </ThemedText>
              </CustomTouchableOpacity>

              <Spacer height={25} />

              <View style={[styles.statsContainer, { backgroundColor: theme.text + '08' }]}>
                <View style={styles.statBox}>
                  <ThemedText style={styles.statValue}>{group.members?.length || 1}</ThemedText>
                  <ThemedText style={styles.statLabel}>Members</ThemedText>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.text + '1A' }]} />
                <View style={styles.statBox}>
                  <ThemedText style={styles.statValue}>{group.isVirtual ? '🌐' : '📍'}</ThemedText>
                  <ThemedText style={styles.statLabel}>{group.isVirtual ? 'Online' : 'In-Person'}</ThemedText>
                </View>
              </View>

              <Spacer height={25} />
              <ThemedText style={styles.sectionLabel}>About</ThemedText>
              <ThemedText style={styles.description}>
                {group.description || `Welcome to ${group.name}! Join us to connect with fellow enthusiasts.`}
              </ThemedText>

              <Spacer height={40} />
              <ThemedButton onPress={handleToggleMembership} title={isMember ? 'Joined ✅' : 'Join Group'} loading={actionLoading} variant={isMember ? 'secondary' : 'primary'} />
              <View style={{ backgroundColor: theme.uiBackground }} />
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: 40,
    padding: 7,
    paddingTop: 8,
    width: 40,
    height: 40,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBg: {
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 60,
  },
  dots: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  shadowWrapper: {
    // This container clips everything outside its bounds
    overflow: 'hidden',
    // We add padding at the top so the top shadow doesn't get cut off
    paddingTop: 20,
    // Pull the wrapper up so the card stays in the same place
    marginTop: -20,
  },
  contentCard: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -5, // Moderate offset
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Android Shadow
    // NOTE: Android's elevation is hard to clip. 
    // To fix Android, we usually set elevation to 0 and use a 
    // background image or a dedicated shadow library.
    elevation: Platform.OS === 'ios' ? 0 : 0,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    color: '#007AFF',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  groupTitle: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DDD',
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    opacity: 0.6,
  },
  boldUsername: {
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 35,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
})

export default GroupDetails