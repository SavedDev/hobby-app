import React, { useState } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useUser } from '../hooks/useUser'

import ThemedView from '../components/layout/ThemedView'
import ThemedText from '../components/ui/ThemedText'
import ThemedTextInput from '../components/forms/ThemedTextInput'

// Mock data for UI design - Replace with Appwrite Realtime later
const MOCK_MESSAGES = [
  { $id: '1', text: 'Hey everyone! Anyone up for pickleball this weekend?', senderId: 'other', username: 'Sarah' },
  { $id: '2', text: 'I am in! Sat morning?', senderId: 'me', username: 'You' },
  { $id: '3', text: 'Count me in too. I have extra paddles if anyone needs them.', senderId: 'other', username: 'Mike' },
]

const Chat = () => {
  const { user } = useUser()
  const [message, setMessage] = useState('')

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === 'me' // Logic will be item.userId === user.$id

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myWrapper : styles.theirWrapper]}>
        {!isMe && <ThemedText style={styles.senderName}>{item.username}</ThemedText>}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <ThemedText style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.text}
          </ThemedText>
        </View>
      </View>
    )
  }

  return (
    <ThemedView safe style={styles.container}>
      {/* Message Area */}
      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={(item) => item.$id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        inverted // Start from bottom
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20} // Adjust based on your tab bar height
      >
        <ThemedTextInput
          inputContainerStyle={styles.containerStyle}
          inputStyle={styles.inputStyle}
          value={message}
          onChangeText={setMessage}
          placeholder='Chat...'
          multiline
          buttonIcon={<ThemedText style={styles.sendButtonText}>↑</ThemedText>}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  myWrapper: {
    alignSelf: 'flex-end',
  },
  theirWrapper: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFF',
  },
  containerStyle: {
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  inputStyle: {
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#eee',
  },
})