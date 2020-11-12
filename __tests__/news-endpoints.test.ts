import supertest from 'supertest'
import App from '../App'
import Mongo from '../database/Mongo'

describe('News intagration tests', () => {
  let server: supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL || '')
    server = supertest(App.server)
  })

  afterEach(async () => {
    await Mongo.getCollection('news').deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should create a news', async () => {
    const data = {
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    }

    const response = await server.post('/news').send(data)
    expect(response.status).toBe(201)
  })

  it('should return an array of news', async () => {
    const newsCollection = await Mongo.getCollection('news')
    await newsCollection.insertMany([
      {
        title: 'test title 1',
        content: 'test content 1',
        authorID: 'testID',
        image: 'http://test.com/test'
      },
      {
        title: 'test title 2',
        content: 'test content 2',
        authorID: 'testID',
        image: 'http://test.com/test'
      },
      {
        title: 'test title 3',
        content: 'test content 3',
        authorID: 'testID',
        image: 'http://test.com/test'
      }
    ])

    const response = await server.get('/news')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })

  it('should return a news', async () => {
    const newsCollection = await Mongo.getCollection('news')
    const news = (await newsCollection.insertOne({
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    })).ops[0]

    const response = await server.get(`/news/${news._id}`)
    expect(response.status).toBe(200)
    expect(response.body.title).toEqual(news.title)
    expect(response.body.content).toEqual(news.content)
    expect(response.body.authorID).toEqual(news.authorID)
    expect(response.body.image).toEqual(news.image)
  })

  it('should update news', async () => {
    const newsCollection = await Mongo.getCollection('news')
    const news = (await newsCollection.insertOne({
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    })).ops[0]

    const dataWithTitle = { title: 'test title updated' }
    let response = await server.put(`/news/${news._id}`).send(dataWithTitle)
    expect(response.status).toBe(200)

    const dataWithContent = { content: 'test content updated' }
    response = await server.put(`/news/${news._id}`).send(dataWithContent)
    expect(response.status).toBe(200)

    const dataWithImage = { image: 'http://test.com/updated' }
    response = await server.put(`/news/${news._id}`).send(dataWithContent)
    expect(response.status).toBe(200)
  })

  it('on PUT:/news should return 400 if no data is passed', async () => {
    const fakeId = 10
    const response = await server.put(`/users/${fakeId}`).send({})
    expect(response.status).toBe(400)
  })

  it('should delete a news', async () => {
    const newsCollection = await Mongo.getCollection('news')
    const news = (await newsCollection.insertOne({
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    })).ops[0]

    const response = await server.delete(`/news/${news._id}`)
    expect(response.status).toBe(200)
  })

  it('on POST:/news should return 400 if title is not passed', async () => {
    const dataWithoutTitle = {
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithoutTitle)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/news should return 400 if content is not passed', async () => {
    const dataWithoutContent = {
      title: 'test title',
      authorID: 'testID',
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithoutContent)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/news should return 400 if title is invalid', async () => {
    const dataWithInvalidTitle = {
      title: 123,
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithInvalidTitle)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/news should return 400 if content is invalid', async () => {
    const dataWithInvalidContent = {
      title: 'test title',
      content: 123,
      authorID: 'testID',
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithInvalidContent)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/news should return 400 if authorID is invalid', async () => {
    const dataWithInvalidAuthorID = {
      title: 'test title',
      content: 'test content',
      authorID: 123,
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithInvalidAuthorID)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/news should return 400 if authorID is not passed', async () => {
    const dataWithoutAuthorID = {
      title: 'test title',
      content: 'test content',
      image: 'http://test.com/test'
    }
    const response = await server.post('/news').send(dataWithoutAuthorID)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('Image should be an URL', async () => {
    const dataWithInvalidImage = {
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'test'
    }
    let response = await server.post('/news').send(dataWithInvalidImage)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()

    const dataWithValidImage = {
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    }

    response = await server.post('/news').send(dataWithValidImage)
    expect(response.status).toBe(201)
  })

  it('on POST:/news should return 400 if image url is not passed', async () => {
    const dataWithoutImage = {
      title: 'test title',
      content: 'test content',
      authorID: 'testID'
    }
    const response = await server.post('/news').send(dataWithoutImage)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on PUT:/news should return 400 if title is invalid', async () => {
    const fakeId = 14
    const dataWithInvalidTitle = {
      title: 123,
      content: 'test content'
    }
    const response = await server.put(`/news/${fakeId}`).send(dataWithInvalidTitle)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on PUT:/news should return 400 if content is invalid', async () => {
    const fakeId = 14
    const dataWithInvalidContent = {
      title: 'test title',
      content: 123
    }
    const response = await server.put(`/news/${fakeId}`).send(dataWithInvalidContent)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/users should return a slug field', async () => {
    const data = {
      title: 'test title',
      content: 'test content',
      authorID: 'testID',
      image: 'http://test.com/test'
    }

    const response = await server.post('/news').send(data)
    expect(response.status).toBe(201)
    expect(response.body.slug).toEqual('test-title')
  })

  it('on PUT:/users when update the title should also update slug field', async () => {
    const newsCollection = await Mongo.getCollection('news')
    const news = (await newsCollection.insertOne({
      title: 'test title',
      content: 'test content',
      slug: 'test-title',
      authorID: 'testID',
      image: 'http://test.com/test'
    })).ops[0]

    const data = { title: 'test title update' }
    const response = await server.put(`/news/${news._id}`).send(data)
    expect(response.status).toBe(200)
    expect((
      await newsCollection.findOne({ _id: news._id })
    ).slug).toEqual('test-title-update')
  })
})
