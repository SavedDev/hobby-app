import { useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native'

import Spacer from '../../../components/layout/Spacer'
import ThemedView from '../../../components/layout/ThemedView'
import ThemedText from '../../../components/ui/ThemedText'
import ThemedButton from '../../../components/ui/ThemedButton'
import ThemedTextInput from '../../../components/forms/ThemedTextInput'
import { useGroups } from '../../../hooks/useGroups'

const CreateGroup = ({ setCloseModal }) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Sports')
  const [subcategory, setSubcategory] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [joinType, setJoinType] = useState('open')
  const [isVirtual, setIsVirtual] = useState(false)
  const [loading, setLoading] = useState(false)

  const { createNewGroup } = useGroups()

  const handleSubmit = async () => {
    if (!name || !category) return
    setLoading(true)
    await createNewGroup({
      name,
      category,
      subcategory,
      privacy,
      joinType,
      isVirtual,
      tags: [category, subcategory].filter(Boolean)
    })
    setCloseModal(true)
    setLoading(false)
  }

  // --- UI Helpers ---
  const OptionSelector = ({ label, options, current, setter }) => (
    <View style={styles.optionWrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, current === opt && styles.chipActive]}
            onPress={() => setter(opt)}
          >
            <ThemedText style={[styles.chipText, current === opt && styles.chipTextActive]}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedText title style={styles.mainTitle}>New Hobby Group</ThemedText>
          <ThemedText style={styles.subtitle}>Fill in the details to start your community.</ThemedText>

          <Spacer height={25} />

          {/* Section: Identity */}
          <View style={styles.section}>
            <ThemedTextInput
              title="What's the name?"
              placeholder="e.g. Downtown Pickleballers"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Spacer height={20} />

          {/* Section: Classification */}
          <View style={styles.section}>
            <ThemedTextInput
              title="Category"
              placeholder="e.g. Sports, Gaming, Art"
              value={category}
              onChangeText={setCategory}
            />
            <Spacer height={15} />
            <ThemedTextInput
              title="Subcategory (Optional)"
              placeholder="e.g. Pickleball, RPG, Painting"
              value={subcategory}
              onChangeText={setSubcategory}
            />
          </View>

          <Spacer height={25} />

          {/* Section: Access Control (Chips instead of Text input) */}
          <OptionSelector
            label="Privacy Setting"
            options={['public', 'private']}
            current={privacy}
            setter={setPrivacy}
          />

          <Spacer height={20} />

          <OptionSelector
            label="Joining Policy"
            options={['open', 'closed']}
            current={joinType}
            setter={setJoinType}
          />

          <Spacer height={25} />

          {/* Modern Toggle for Virtual */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setIsVirtual(!isVirtual)}
          >
            <View>
              <ThemedText style={styles.toggleLabel}>Virtual Group</ThemedText>
              <ThemedText style={styles.toggleSub}>This group meets online only</ThemedText>
            </View>
            <View style={[styles.switch, isVirtual && styles.switchOn]}>
              <View style={[styles.knob, isVirtual && styles.knobOn]} />
            </View>
          </TouchableOpacity>

          <Spacer height={40} />

          <ThemedButton
            onPress={handleSubmit}
            disabled={loading || !name}
            title={loading ? 'Creating...' : 'Launch Group'}
          />
          <Spacer height={30} />
        </ScrollView>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default CreateGroup

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  mainTitle: { fontSize: 24, fontWeight: '800' },
  subtitle: { opacity: 0.5, fontSize: 14, marginTop: 4 },
  section: { width: '100%' },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, opacity: 0.8 },

  // Chip Selectors
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#007AFF15',
    borderColor: '#007AFF',
  },
  chipText: { fontSize: 14, fontWeight: '600', opacity: 0.6 },
  chipTextActive: { color: '#007AFF', opacity: 1 },

  // Custom Toggle
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
  switch: {
    width: 50,
    height: 28,
    borderRadius: 15,
    backgroundColor: '#D1D1D6',
    padding: 2,
  },
  switchOn: { backgroundColor: '#34C759' },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  knobOn: { alignSelf: 'flex-end' },
})