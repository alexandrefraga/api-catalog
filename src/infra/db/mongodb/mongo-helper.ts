import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect (uri: string): Promise<void> {
    this.url = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: new ObjectId(_id).toHexString() })
  },

  mapAll: (arrayCollections: any[]): any[] => {
    return arrayCollections.map(c => MongoHelper.map(c))
  }
}
