import { bucketId, client } from '../lib/appwrite'
import { Storage } from 'react-native-appwrite'

// Initializing Storage
const storage = new Storage(client)

export const viewUserProfileUrl = (profileImage) => {
  if (!profileImage) return null

  // Ensure we are using getFileView for the Free Tier
  try {
    return storage.getFileViewURL(bucketId, profileImage).href
  } catch (e) {
    return null
  }
}