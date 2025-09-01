import { Client, Avatars, Account, Databases, TablesDB } from "react-native-appwrite"

export const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("68a0ee36000e5ec1672c") // Replace with your project ID

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)
export const tablesDB = new TablesDB(client)


// APPWRITE_PROJECT_NAME: "hobby-app"