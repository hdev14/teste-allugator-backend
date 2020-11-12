import supertest from 'supertest'
import App from '../App'
import Mongo from '../database/Mongo'

describe('Users intagration tests', () => {
  let server: supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL || '')
    server = supertest(App.server)
  })

  afterEach(async () => {
    await Mongo.getCollection('users').deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should create an user', async () => {
    const data = {
      name: 'test user',
      email: 'test@email.com'
    }

    const response = await server.post('/users').send(data)
    expect(response.status).toBe(201)
  })

  it('should return an array of users', async () => {
    const userCollection = await Mongo.getCollection('users')
    await userCollection.insertMany([
      {
        name: 'test user 1',
        email: 'test1@email.com'
      },
      {
        name: 'test user 2',
        email: 'test3@email.com'
      },
      {
        name: 'test user 3',
        email: 'test3@email.com'
      }
    ])

    const response = await server.get('/users')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })

  it('should return an user', async () => {
    const userCollection = await Mongo.getCollection('users')
    const user = (await userCollection.insertOne({
      name: 'test user',
      email: 'test@email.com'
    })).ops[0]

    const response = await server.get(`/users/${user._id}`)
    expect(response.status).toBe(200)
    expect(response.body.name).toEqual(user.name)
    expect(response.body.email).toEqual(user.email)
  })

  it('should update user', async () => {
    const userCollection = await Mongo.getCollection('users')
    const user = (await userCollection.insertOne({
      name: 'test user',
      email: 'test@email.com'
    })).ops[0]

    const dataWithName = { name: 'test user updated' }
    let response = await server.put(`/users/${user._id}`).send(dataWithName)
    expect(response.status).toBe(200)

    const dataWithEmail = { email: 'updated@email.com' }
    response = await server.put(`/users/${user._id}`).send(dataWithEmail)
    expect(response.status).toBe(200)
  })

  it('on PUT:/users should return 400 if no data is passed', async () => {
    const userCollection = await Mongo.getCollection('users')
    const user = (await userCollection.insertOne({
      name: 'test user',
      email: 'test@email.com'
    })).ops[0]

    const response = await server.put(`/users/${user._id}`).send({})
    expect(response.status).toBe(400)
  })

  it('should delete an user', async () => {
    const userCollection = await Mongo.getCollection('users')
    const user = (await userCollection.insertOne({
      name: 'test user',
      email: 'test@email.com'
    })).ops[0]

    const response = await server.delete(`/users/${user._id}`)
    expect(response.status).toBe(200)
  })

  it('on POST:/users should return 400 if name is not passed', async () => {
    const dataWithoutName = {
      email: 'test@email.com'
    }
    const response = await server.post('/users').send(dataWithoutName)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/users should return 400 if email is not passed', async () => {
    const dataWithoutEmail = {
      name: 'test user'
    }
    const response = await server.post('/users').send(dataWithoutEmail)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/users should return 400 if name is invalid', async () => {
    const dataWithInvalidName = {
      name: 123,
      email: 'test@email.com'
    }
    const response = await server.post('/users').send(dataWithInvalidName)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on POST:/users should return 400 if email is invalid', async () => {
    const dataWithInvalidEmail = {
      name: 'test user',
      email: 'invalidemail.com'
    }
    const response = await server.post('/users').send(dataWithInvalidEmail)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on PUT:/users should return 400 if name is invalid', async () => {
    const fakeId = 14
    const dataWithInvalidName = {
      name: 123,
      email: 'test@email.com'
    }
    const response = await server.put(`/users/${fakeId}`).send(dataWithInvalidName)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })

  it('on PUT:/users should return 400 if email is invalid', async () => {
    const fakeId = 14
    const dataWithInvalidEmail = {
      name: 'test user',
      email: 'invalidemail.com'
    }
    const response = await server.put(`/users/${fakeId}`).send(dataWithInvalidEmail)
    expect(response.status).toBe(400)
    expect(response.body.error).toBeTruthy()
  })
})
