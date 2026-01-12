import { Client, Avatars, Account, Databases, TablesDB } from "react-native-appwrite"

export const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("68a0ee36000e5ec1672c") // Replace with your project ID

export const databaseId = '68ab626a00016c1fae96'
export const groupTable = '68ab634f003de5b45029'
export const userTable = '68aca8bd000ffb76c82a'
export const bucketId = '69620e90001415e8d2f5'

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)
export const tablesDB = new TablesDB(client)


// APPWRITE_PROJECT_NAME: "hobby-app"