import Mongo from '../../database/Mongo'

describe('News intagration tests', () => {
  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL || '')
  })

  afterEach(async () => {
    await Mongo.getCollection('news').deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should something', async () => {

  })
})
