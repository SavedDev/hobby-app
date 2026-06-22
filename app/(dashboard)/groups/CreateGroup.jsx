import { useState, useMemo, useRef } from 'react'
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native'

import { router } from 'expo-router'
import { useGroups } from '../../../hooks/useGroups'
import { uploadImage } from '../../../helpers/uploadPhotoService'
import { viewUserProfileUrl } from '../../../helpers/previewFileURL'
import { POPULAR_CATEGORIES } from '../../../constants/categories'

import Spacer from '../../../components/layout/Spacer'
import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedButton from '../../../components/ui/ThemedButton'
import ThemedTextInput from '../../../components/forms/ThemedTextInput'
import ThemedOptionSelector from '../../../components/forms/ThemedOptionSelector'
import CustomTouchableOpacity from '../../../components/ui/CustomTouchableOpacity'
import PopUpModal from '../../../components/ui/PopUpModal'

// Get screen width for paging
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const CreateGroup = () => {
  const scrollRef = useRef(null)
  const [step, setStep] = useState(1)
  const totalSteps = 4

  // Form Data State
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [joinType, setJoinType] = useState('open')
  const [isVirtual, setIsVirtual] = useState(false)
  const [loading, setLoading] = useState(false)
  const [groupImageId, setGroupImageId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const { createNewGroup } = useGroups()

  // --- Animation & Navigation Logic ---
  const goToStep = (targetStep) => {
    Keyboard.dismiss()
    const pageIndex = targetStep - 1

    // Animate the scroll to the next page
    scrollRef.current?.scrollTo({
      x: pageIndex * SCREEN_WIDTH,
      animated: true,
    })
    setStep(targetStep)
  }

  // --- Manual Scrolling Logic ---
  // const handleManualScroll = (event) => {
  //   const contentOffset = event.nativeEvent.contentOffset.x
  //   const currentIndex = Math.round(contentOffset / SCREEN_WIDTH)
  //   setStep(currentIndex + 1)
  // }

  // --- Logic Helpers ---
  const progressWidth = useMemo(() => `${(step / totalSteps) * 100}%`, [step])
  const isNameValid = name && name.trim().length >= 4

  const handleConfirmExit = () => {
    setModalVisible(false)
    // instant reset to the groups tab
    router.dismissAll()
  }

  const handlePickImage = async () => {
    try {
      setUploadingImage(true)
      const fileId = await uploadImage('group_temp')
      if (fileId) setGroupImageId(fileId)
    } catch (error) {
      alert("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async () => {
    if (!name || !category) return
    setLoading(true)

    try {
      const newGroup = await createNewGroup({
        name: name.trim(),
        category,
        subcategory,
        privacy,
        joinType,
        isVirtual,
        groupImage: groupImageId,
        tags: [category, subcategory].filter(Boolean)
      })

      if (newGroup?.$id) {
        router.back()
        router.push({
          pathname: `/groups/${newGroup.$id}`,
          params: { name: newGroup.name }
        })
      }
    } catch (error) {
      console.error("Failed to launch group:", error)
      alert("Sorry! There was an error creating your group.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemedView safe noBottomPadding style={styles.container}>
      {/* Fixed Progress Bar */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
      </View>

      {/* Fixed Header */}
      <View style={styles.headerRow}>
        {step > 1 ? (
          <CustomTouchableOpacity onPress={() => goToStep(step - 1)}>
            <ThemedText style={styles.backBtn}>Back</ThemedText>
          </CustomTouchableOpacity>
        ) : <View style={{ width: 40 }} />}

        <ThemedText style={styles.stepIndicator}>Step {step} of {totalSteps}</ThemedText>

        <PopUpModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onConfirm={handleConfirmExit}
          title="Discard Group?"
          message="You'll lose all your progress."
          cancelText="Keep Editing"
          confirmText="Discard"
        />

        <CustomTouchableOpacity onPress={() => setModalVisible(true)}>
          <ThemedText style={styles.exitBtn}>Exit</ThemedText>
        </CustomTouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false} // Force button navigation for better UX validation
        showsHorizontalScrollIndicator={false}
        // onMomentumScrollEnd={handleManualScroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1: IDENTITY */}
        <View style={styles.page}>
          <ThemedText title style={styles.mainTitle}>Name your group</ThemedText>
          <ThemedText style={styles.subtitle}>Choose something catchy and clear.</ThemedText>
          <Spacer height={30} />
          <ThemedTextInput
            title="Group Name"
            placeholder="e.g. Downtown Pickleballers"
            value={name}
            onChangeText={setName}
            inputStyle={styles.groupNameInput}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Spacer height={20} />
          <ThemedButton title="Continue" onPress={() => goToStep(2)} disabled={!isNameValid} />
        </View>

        {/* STEP 2: CLASSIFICATION */}
        <View style={styles.page}>
          <ThemedText title style={styles.mainTitle}>What's the vibe?</ThemedText>
          <ThemedText style={styles.subtitle}>Select a category and a specific hobby.</ThemedText>

          <Spacer height={20} />

          <View>
            <ThemedText style={styles.label}>Main Category</ThemedText>
            <Spacer />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.twoRowScrollContainer}
            >
              <View style={styles.categoryGridWrapper}>
                {POPULAR_CATEGORIES.map((item) => {
                  const isSelected = category === item.label
                  return (
                    <CustomTouchableOpacity
                      key={item.id}
                      style={[styles.catCardSmall, isSelected && styles.catCardActive]}
                      onPress={() => {
                        setCategory(item.label)
                        setSubcategory('')
                      }}
                    >
                      <ThemedText style={styles.catIconSmall}>{item.icon}</ThemedText>
                      <ThemedText style={[styles.catLabelSmall, isSelected && styles.catLabelActive]}>
                        {item.label}
                      </ThemedText>
                    </CustomTouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>
          </View>

          <Spacer height={25} />

          {/* Dynamic Suggestions Row */}
          {category && (
            <View>
              <ThemedText style={styles.label}>Suggestions</ThemedText>
              <Spacer />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionScroll}>
                {POPULAR_CATEGORIES.find(c => c.label === category)?.suggestions.map((sug) => (
                  <CustomTouchableOpacity
                    key={sug}
                    style={[styles.suggestionChip, subcategory === sug && styles.suggestionChipActive]}
                    onPress={() => setSubcategory(sug)}
                  >
                    <ThemedText style={[styles.suggestionText, subcategory === sug && styles.suggestionTextActive]}>
                      {sug}
                    </ThemedText>
                  </CustomTouchableOpacity>
                ))}
              </ScrollView>
              <Spacer height={20} />
            </View>
          )}

          <ThemedTextInput
            title="Specific Hobby"
            placeholder="Or type your own..."
            value={subcategory}
            onChangeText={setSubcategory}
            editable={!!category}
            styles={{ width: '100%' }}
          />

          <Spacer height={30} />
          <ThemedButton
            title="Continue"
            onPress={() => goToStep(3)}
            disabled={!category || subcategory.trim().length < 2}
          />
        </View>

        {/* STEP 3: SETTINGS */}
        <View style={styles.page}>
          <ThemedText title style={styles.mainTitle}>Group Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Finalize how people join and interact.</ThemedText>
          <Spacer height={30} />
          <ThemedOptionSelector
            label="Privacy Setting"
            options={['public', 'private']}
            current={privacy}
            setter={setPrivacy}
          />
          <Spacer height={20} />
          <ThemedOptionSelector
            label="Joining Policy"
            options={['open', 'closed']}
            current={joinType}
            setter={setJoinType}
          />
          <Spacer height={25} />
          <CustomTouchableOpacity style={styles.toggleRow} onPress={() => setIsVirtual(!isVirtual)}>
            <View>
              <ThemedText style={styles.toggleLabel}>Virtual Group</ThemedText>
              <ThemedText style={styles.toggleSub}>Meets online only</ThemedText>
            </View>
            <View style={[styles.switch, isVirtual && styles.switchOn]}>
              <View style={[styles.knob, isVirtual && styles.knobOn]} />
            </View>
          </CustomTouchableOpacity>
          <Spacer height={30} />
          <ThemedButton title="Continue" onPress={() => goToStep(4)} />
        </View>

        {/* STEP 4: IMAGE */}
        <View style={styles.page}>
          <ThemedText title style={styles.mainTitle}>Add a cover photo</ThemedText>
          <ThemedText style={styles.subtitle}>Visual groups get more members.</ThemedText>
          <Spacer height={30} />
          <CustomTouchableOpacity
            style={styles.imageUploadBox}
            onPress={handlePickImage}
            disabled={uploadingImage}
          >
            {groupImageId ? (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 300,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                transform: [{ translateY: 27 }, { scale: 1.2 }],
              }}>
                <Image source={{ uri: viewUserProfileUrl(groupImageId) }} style={styles.previewImage} />
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                {uploadingImage ? <ActivityIndicator color="#007AFF" /> : (
                  <>
                    <ThemedText style={styles.uploadIcon}>📸</ThemedText>
                    <ThemedText style={styles.uploadText}>Tap to select photo</ThemedText>
                  </>
                )}
              </View>
            )}
          </CustomTouchableOpacity>
          <Spacer height={40} />
          <ThemedButton
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || uploadingImage}
            title="Launch Group"
          />
        </View>
      </ScrollView>
    </ThemedView>
  )
}

export default CreateGroup

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Progress bar
  progressWrapper: { paddingHorizontal: 20, paddingTop: 10 },
  progressContainer: {
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBar: { height: '100%', backgroundColor: '#007AFF' },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    // height: 50,
  },
  backBtn: { color: '#007AFF', fontWeight: '600' },
  exitBtn: { color: '#ba0000ff', fontWeight: '600' },
  stepIndicator: { fontSize: 12, fontWeight: '700', opacity: 0.4 },

  // Swipe Page Styles
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  mainTitle: { fontSize: 26, fontWeight: '800' },
  subtitle: { opacity: 0.5, fontSize: 15, marginTop: 6 },

  // STEP 1: GROUP NAME
  groupNameInput: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 16,
  },

  // STEP 2: GROUP CATEGORY
  twoRowScrollContainer: {
    paddingRight: 20,
  },
  categoryGridWrapper: {
    height: 120, // Height of 2 cards + gap
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCardSmall: {
    width: SCREEN_WIDTH * 0.4, // Shows 2.5 columns to hint at scroll
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catIconSmall: { fontSize: 18, marginRight: 5 },
  catLabelSmall: { fontSize: 14, fontWeight: '600', opacity: 0.7 },
  catCardActive: {
    backgroundColor: '#007AFF10',
    borderColor: '#007AFF',
  },
  catLabelActive: { color: '#007AFF', opacity: 1 },

  // Suggestion Chip Styles (Keep these from before)
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 8,
  },
  suggestionChipActive: { backgroundColor: '#007AFF' },
  suggestionText: { fontSize: 13, fontWeight: '600', color: '#666' },
  suggestionTextActive: { color: '#FFF' },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
  },
  toggleLabel: { fontWeight: '700', fontSize: 16 },
  toggleSub: { fontSize: 12, opacity: 0.5 },
  switch: { width: 50, height: 28, borderRadius: 15, backgroundColor: '#D1D1D6', padding: 2 },
  switchOn: { backgroundColor: '#34C759' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF' },
  knobOn: { alignSelf: 'flex-end' },

  imageUploadBox: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 2,
    borderColor: 'rgba(0,122,255,0.2)',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  uploadPlaceholder: { alignItems: 'center' },
  uploadIcon: { fontSize: 40, marginBottom: 10 },
  uploadText: { fontWeight: '600', color: '#007AFF' },
})