import { imageBuckets, storage } from '../lib/appwrite'

export const viewUserProfileUrl = (profileImage, bucketType = 'profileBucket') => {
  if (!profileImage) return null

  // Ensure we are using getFileView for the Free Tier
  try {
    return storage.getFileViewURL(imageBuckets[bucketType], profileImage).href
  } catch (e) {
    return null
  }
}