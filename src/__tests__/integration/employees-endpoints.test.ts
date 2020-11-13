import supertest from 'supertest'
import App from '../../App'
import Mongo from '../../database/Mongo'
import employeesFixture from '../employees-fixture.json'

describe('Integration tests for employee endpoints', () => {
  let server: supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    // Inicializa o Jest Mongo
    await Mongo.connect(process.env.MONGO_URL || '')
    server = supertest(App.server)
  })

  beforeEach(async () => {
    const employeesCollection = Mongo.getCollection('employees')
    await employeesCollection.insertMany(employeesFixture)
  })

  afterEach(async () => {
    const employeesCollection = Mongo.getCollection('employees')
    await employeesCollection.deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should get a list of employee by name', async () => {
    let response = await server.get('/employees/name').query({ name: 'Aaron' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await server.get('/employees/name').query({ name: 'Abbie' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if name is not passed', async () => {
    const response = await server.get('/employees/name').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de nome é obrigatório'
    })
  })

  it('should get a list of employee by cpf', async () => {
    let response = await server.get('/employees/cpf').query({ cpf: '85235708709' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Aaron Aaberg')

    response = await server.get('/employees/cpf').query({ cpf: '59984408701' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Aaron Aaby')

    response = await server.get('/employees/cpf').query({ cpf: '32439637882' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Abbie Aagaard')
  })
})