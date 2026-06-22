import { useState, useEffect, useMemo } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { viewUserProfileUrl } from '../../../../helpers/previewFileURL'
import { uploadImage } from '../../../../helpers/uploadPhotoService'
import { useGroups } from '../../../../hooks/useGroups'
import { POPULAR_CATEGORIES } from '../../../../constants/categories'

import Spacer from '../../../../components/layout/Spacer'
import ThemedView from '../../../../components/layout/ThemedView'
import ThemedText from '../../../../components/ui/ThemedText'
import ThemedButton from '../../../../components/ui/ThemedButton'
import ThemedTextInput from '../../../../components/forms/ThemedTextInput'
import ThemedOptionSelector from '../../../../components/forms/ThemedOptionSelector'
import CustomTouchableOpacity from '../../../../components/ui/CustomTouchableOpacity'
import ThemedLoader from '../../../../components/ui/ThemedLoader'
import PopUpModal from '../../../../components/ui/PopUpModal'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// --- Accordion Component with Reset ---
const AccordionSection = ({ title, children, isOpen, onPress, isEdited, onReset }) => {
  return (
    <View style={styles.accordionContainer}>
      <View style={styles.accordionHeader}>
        <CustomTouchableOpacity style={styles.accordionTitleRow} onPress={onPress}>
          <View style={styles.accordionTitleWithDot}>
            <ThemedText title style={styles.sectionTitle}>{title}</ThemedText>
            {isEdited && <View style={styles.editedDot} />}
          </View>

          {isEdited && (
            <CustomTouchableOpacity onPress={onReset} style={styles.resetBtn}>
              <ThemedText style={styles.resetText}>Reset</ThemedText>
            </CustomTouchableOpacity>
          )}

          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="rgba(0,0,0,0.3)" />
        </CustomTouchableOpacity>
      </View>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  )
}

const EditGroup = () => {
  const { groupId } = useLocalSearchParams()
  const { fetchGroupById, updateGroup, deleteGroup } = useGroups()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [exitModalVisible, setExitModalVisible] = useState(false)
  const [openSection, setOpenSection] = useState('identity')
  const [originalData, setOriginalData] = useState(null)

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [joinType, setJoinType] = useState('open')
  const [isVirtual, setIsVirtual] = useState(false)
  const [groupImageId, setGroupImageId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return
      try {
        const data = await fetchGroupById(groupId)
        if (data) {
          setOriginalData(data)
          setName(data.name)
          setCategory(data.category)
          setSubcategory(data.subcategory)
          setPrivacy(data.privacy)
          setJoinType(data.joinType)
          setIsVirtual(data.isVirtual)
          setGroupImageId(data.groupImage)
        }
      } catch (error) {
        Alert.alert("Error", "Could not load group.")
        router.back()
      } finally {
        setFetching(false)
      }
    }
    loadGroupData()
  }, [groupId])

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenSection(openSection === section ? null : section)
  }

  // Edit Detection
  const hasIdentityChanges = originalData?.name !== name || originalData?.groupImage !== groupImageId
  const hasClassificationChanges = originalData?.category !== category || originalData?.subcategory !== subcategory
  const hasSettingsChanges = originalData?.privacy !== privacy || originalData?.joinType !== joinType || originalData?.isVirtual !== isVirtual
  const isEdited = hasIdentityChanges || hasClassificationChanges || hasSettingsChanges

  // Reset Actions
  const resetIdentity = () => { setName(originalData.name); setGroupImageId(originalData.groupImage) }
  const resetClassification = () => { setCategory(originalData.category); setSubcategory(originalData.subcategory) }
  const resetSettings = () => { setPrivacy(originalData.privacy); setJoinType(originalData.joinType); setIsVirtual(originalData.isVirtual) }

  const handleUpdate = async () => {
    if (!name || !category) return
    setLoading(true)
    try {
      const updatedGroup = await updateGroup(groupId, {
        name: name.trim(),
        category,
        subcategory,
        privacy,
        joinType,
        isVirtual,
        groupImage: groupImageId,
        tags: [category, subcategory].filter(Boolean)
      })
      if (updatedGroup) {
        router.dismissTo({ pathname: `/groups/${groupId}`, params: { refresh: true } })
      }
    } catch (error) {
      Alert.alert("Update Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(groupId, groupImageId)
      router.dismissAll()
    } catch (error) {
      Alert.alert("Error", "Could not delete group.")
    }
  }

  if (fetching) return <ThemedLoader />

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <PopUpModal
          visible={exitModalVisible}
          onCancel={() => setExitModalVisible(false)}
          onConfirm={() => router.back()}
          title="Discard Changes?"
          message="You'll lose all your progress."
          cancelText="Keep Editing"
          confirmText="Discard"
        />
        <CustomTouchableOpacity onPress={() => isEdited ? setExitModalVisible(true) : router.back()}>
          <ThemedText style={styles.cancelBtn}>Cancel</ThemedText>
        </CustomTouchableOpacity>
        <ThemedText style={styles.headerTitle}>Manage Group</ThemedText>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        <AccordionSection
          title="Identity"
          isOpen={openSection === 'identity'}
          onPress={() => toggleSection('identity')}
          isEdited={hasIdentityChanges}
          onReset={resetIdentity}
        >
          <ThemedText style={styles.label}>Cover Photo</ThemedText>
          <CustomTouchableOpacity
            style={styles.imageUploadBox}
            onPress={async () => {
              setUploadingImage(true)
              const id = await uploadImage(groupId)
              if (id) setGroupImageId(id)
              setUploadingImage(false)
            }}
          >
            {groupImageId ? (
              <View style={[styles.previewImageBox, { opacity: uploadingImage ? 0.3 : 1 }]}>
                <Image source={{ uri: viewUserProfileUrl(groupImageId) }} style={styles.previewImage} />
                {!uploadingImage && <Entypo style={styles.editIcon} name="edit" size={22} />}
              </View>
            ) : (
              <ThemedText style={{ opacity: uploadingImage ? 0.3 : 1 }}>📸 Add Photo</ThemedText>
            )}
            {uploadingImage && <ActivityIndicator style={styles.imageLoader} color="#007AFF" />}
          </CustomTouchableOpacity>
          <Spacer height={20} />
          <ThemedTextInput title="Group Name" value={name} onChangeText={setName} autoCorrect={false} autoCapitalize="words" />
        </AccordionSection>

        <AccordionSection
          title="Classification"
          isOpen={openSection === 'classification'}
          onPress={() => toggleSection('classification')}
          isEdited={hasClassificationChanges}
          onReset={resetClassification}
        >
          <ThemedText style={styles.label}>Main Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.twoRowScrollContainer}>
            <View style={styles.categoryGridWrapper}>
              {POPULAR_CATEGORIES.map((item) => (
                <CustomTouchableOpacity
                  key={item.id}
                  style={[styles.catCardSmall, category === item.label && styles.catCardActive]}
                  onPress={() => { setCategory(item.label); setSubcategory('') }}
                >
                  <ThemedText style={styles.catIconSmall}>{item.icon}</ThemedText>
                  <ThemedText style={[styles.catLabelSmall, category === item.label && styles.catLabelActive]}>{item.label}</ThemedText>
                </CustomTouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Spacer height={10} />
          {category && (
            <View>
              <ThemedText style={styles.label}>Suggestions</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionScroll}>
                {POPULAR_CATEGORIES.find(c => c.label === category)?.suggestions.map((sug) => (
                  <CustomTouchableOpacity
                    key={sug}
                    style={[styles.suggestionChip, subcategory === sug && styles.suggestionChipActive]}
                    onPress={() => setSubcategory(sug)}
                  >
                    <ThemedText style={[styles.suggestionText, subcategory === sug && styles.suggestionTextActive]}>{sug}</ThemedText>
                  </CustomTouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <ThemedTextInput title="Specific Hobby" value={subcategory} onChangeText={setSubcategory} />
        </AccordionSection>

        <AccordionSection
          title="Settings"
          isOpen={openSection === 'settings'}
          onPress={() => toggleSection('settings')}
          isEdited={hasSettingsChanges}
          onReset={resetSettings}
        >
          <ThemedOptionSelector label="Privacy" options={['public', 'private']} current={privacy} setter={setPrivacy} />
          <Spacer height={15} />
          <ThemedOptionSelector label="Joining" options={['open', 'closed']} current={joinType} setter={setJoinType} />
          <Spacer height={20} />
          <CustomTouchableOpacity style={styles.toggleRow} onPress={() => setIsVirtual(!isVirtual)}>
            <View><ThemedText style={styles.toggleLabel}>Virtual Group</ThemedText><ThemedText style={styles.toggleSub}>Meets online only</ThemedText></View>
            <View style={[styles.switch, isVirtual && styles.switchOn]}><View style={[styles.knob, isVirtual && styles.knobOn]} /></View>
          </CustomTouchableOpacity>
        </AccordionSection>

        <Spacer height={40} />
        <ThemedButton title="Save" disabled={!isEdited} loading={loading} onPress={handleUpdate} />
        <CustomTouchableOpacity style={styles.deleteBtnContainer} onPress={() => setShowDeleteConfirm(true)}>
          <ThemedText style={styles.deleteBtnText}>Delete Group</ThemedText>
        </CustomTouchableOpacity>

        <PopUpModal
          visible={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteGroup}
          title="Delete Group?"
          message="This action is permanent. All group data will be lost forever."
          confirmText="Delete"
        />
        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  cancelBtn: { color: '#FF3B30', fontSize: 16 },
  scrollContent: { padding: 20 },

  accordionContainer: { marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accordionTitleRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  accordionTitleWithDot: { flexDirection: 'row', alignItems: 'center' },
  accordionContent: { padding: 18, paddingTop: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  editedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginLeft: 8 },

  resetBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255, 59, 48, 0.1)' },
  resetText: { color: '#FF3B30', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  label: { fontWeight: '600', marginBottom: 8, opacity: 0.6, fontSize: 13 },
  imageUploadBox: { width: '100%', height: 160, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderStyle: 'dashed' },
  previewImageBox: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', borderRadius: 15, opacity: 0.8 },
  editIcon: { position: 'absolute', color: '#FFF', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 12, borderRadius: 50 },
  imageLoader: { position: 'absolute' },

  categoryGridWrapper: { flexDirection: 'column', flexWrap: 'wrap', height: 160 },
  catCardSmall: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', marginRight: 10, marginBottom: 10, alignItems: 'center', minWidth: 120 },
  catCardActive: { backgroundColor: '#007AFF' },
  catIconSmall: { fontSize: 20 },
  catLabelSmall: { fontSize: 12, fontWeight: '600' },
  catLabelActive: { color: '#FFF' },

  suggestionChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)', marginRight: 8, marginBottom: 10 },
  suggestionChipActive: { backgroundColor: '#007AFF' },
  suggestionTextActive: { color: '#FFF' },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 16, fontWeight: '600' },
  toggleSub: { fontSize: 12, opacity: 0.5 },
  switch: { width: 46, height: 26, borderRadius: 13, backgroundColor: '#D1D1D6', padding: 2 },
  switchOn: { backgroundColor: '#34C759' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF' },
  knobOn: { alignSelf: 'flex-end' },

  deleteBtnContainer: { padding: 20, alignItems: 'center' },
  deleteBtnText: { color: '#FF3B30', fontWeight: '600' },
})

export default EditGroup