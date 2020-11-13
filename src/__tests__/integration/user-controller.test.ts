import supertest from 'supertest'
import App from '../../App'
import Mongo from '../../database/Mongo'

describe('News intagration tests', () => {
  let server: supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    // Inicializa o Jest Mongo
    await Mongo.connect(process.env.MONGO_URL || '')
    server = supertest(App.server)
  })

  afterEach(async () => {
    await Mongo.getCollection('news').deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should something', async () => {
    // const data = {
    //   title: 'test title',
    //   content: 'test content',
    //   authorID: 'testID',
    //   image: 'http://test.com/test'
    // }

    // const response = await server.post('/news').send(data)
    // expect(response.status).toBe(201)
  })
})
