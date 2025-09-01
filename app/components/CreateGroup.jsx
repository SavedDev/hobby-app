import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import Spacer from '../../components/layout/Spacer'
import ThemedView from '../../components/layout/ThemedView'
import ThemedText from '../../components/ui/ThemedText'
import ThemedButton from '../../components/ui/ThemedButton'
import ThemedTextInput from '../../components/forms/ThemedTextInput'
import ThemedCheckbox from '../../components/forms/ThemedCheckbox'

import { useGroups } from '../../hooks/useGroups'

const CreateGroup = ({ setCloseModal }) => {
  const [name, setName] = useState('Jarrell pickeball')
  // const [description, setDescription] = useState('we meet here')
  const [category, setCategory] = useState('sports')
  const [subcategory, setSubcategory] = useState('pickleball')
  const [privacy, setPrivacy] = useState('public')
  const [tags, setTags] = useState([])
  // const [memberLimit, setMemberLimit] = useState(10000)
  const [joinType, setJoinType] = useState('open')
  const [isVirtual, setIsVirtual] = useState(false)

  const [loading, setLoading] = useState(false)

  const { createNewGroup } = useGroups()

  const router = useRouter()

  const handleSubmit = async () => {
    console.log('Create group button pressed')
    if (!name || !category || !privacy || !joinType) {
      return
    }

    setLoading(true)

    await createNewGroup({
      name,
      category,
      subcategory,
      privacy,
      tags,
      joinType,
      isVirtual,
      // for settings in the future
      // memberLimit,
      // description,
    })

    // reset fields
    // setName('')
    // setDescription('')
    // setCategory('')
    // setPrivacy('')
    // setTags([])
    // setMemberLimit(10000)
    // setJoinType('open')

    // redirect
    setCloseModal(true)
    router.replace('/(dashboard)/Home')

    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ width: '100%', padding: 0 }}>
        <ThemedView style={styles.container}>
          <ThemedText title>Create new group</ThemedText>

          <Spacer height={20} />

          <ThemedTextInput
            title='Group Name'
            placeholder='Group name'
            value={name}
            onChangeText={setName}
          />

          {/* <Spacer height={10} />

          <ThemedTextInput
            title='Description'
            placeholder='Description'
            value={description}
            onChangeText={setDescription}
            multiline
          /> */}

          <Spacer height={10} />

          <ThemedTextInput
            title='Category'
            placeholder='Category'
            value={category}
            onChangeText={setCategory}
          />

          <Spacer height={10} />

          <ThemedTextInput
            title='Subcategory'
            placeholder='Subcategory'
            value={subcategory}
            onChangeText={setSubcategory}
          />

          <Spacer height={10} />

          <ThemedTextInput
            title='Privacy'
            placeholder='Privacy (public/private)'
            value={privacy}
            onChangeText={setPrivacy}
          />

          <Spacer height={10} />

          <ThemedTextInput
            title='Tags'
            placeholder='Tags (comma separated)'
            value={tags.join(', ')}
            onChangeText={(text) => setTags(text.split(',').map(tag => tag.trim()))}
          />

          {/* <Spacer height={10} />

          <ThemedTextInput
            title='Member Limit'
            placeholder='Member limit'
            value={String(memberLimit)}
            onChangeText={(text) => setMemberLimit(Number(text))}
            keyboardType='numeric'
          /> */}

          <Spacer height={10} />

          <ThemedTextInput
            title='Join Type'
            placeholder='Join type (open/closed)'
            value={joinType}
            onChangeText={setJoinType}
          />

          <Spacer height={10} />

          <ThemedCheckbox
            title='Virtual group'
            checkboxValue={isVirtual}
            setCheckboxValue={setIsVirtual}
          />

          <Spacer height={20} />

          <ThemedButton
            onPress={handleSubmit}
            disabled={loading}
            title={loading ? 'Creating...' : 'Create Group'}
          />
        </ThemedView>
      </ScrollView >
    </TouchableWithoutFeedback>
  )
}

export default CreateGroup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})