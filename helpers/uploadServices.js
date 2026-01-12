import * as ImagePicker from 'expo-image-picker'
import { bucketId, client } from '../lib/appwrite'
import { ID, Storage } from 'react-native-appwrite'

// Initializing Storage
const storage = new Storage(client)

export const getProfileUrl = (profileImage) => {
  if (!profileImage) return null

  // Ensure we are using getFileView for the Free Tier
  try {
    const result = storage.getFileView(bucketId, profileImage)
    return result.href
  } catch (e) {
    return null
  }
}

export const uploadProfilePhoto = async (userId) => {
  try {
    // 1. Permission Check (Crucial for iOS/Android)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!")
      return null
    }

    // 2. Pick Image
    const result = await ImagePicker.launchImageLibraryAsync({
      // Use an array of strings for modern Expo versions
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    })
    if (result.canceled || !result.assets) return null
    const asset = result.assets[0]

    // FIX 2: Format the file object specifically for the Appwrite RN SDK
    // React Native needs the URI to look like a file reference
    const file = {
      name: asset.fileName || `${userId}_${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
      size: asset.fileSize,
      uri: asset.uri,
    }

    // 3. Upload to Appwrite
    const uploadedFile = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    )

    return uploadedFile.$id
  } catch (error) {
    // FIX 3: Log the specific Appwrite error message
    console.error("Upload error details:", error.message)
    throw error
  }
}