import supertest from 'supertest'
import App from '../../App'
import Mongo from '../../database/Mongo'
import { Status } from '../../types'
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

  it('should return a error if cpf is not passed', async () => {
    const response = await server.get('/employees/cpf').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de cpf é obrigatório'
    })
  })

  it('should get a list of employee by role', async () => {
    let response = await server.get('/employees/role').query({ role: 'Dev Jr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await server.get('/employees/role').query({ role: 'PO Jr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await server.get('/employees/role').query({ role: 'AC Sr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if role is not passed', async () => {
    const response = await server.get('/employees/role').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de cargo é obrigatório'
    })
  })

  it('should get a list of employee by register date', async () => {
    let response = await server.get('/employees/register-date').query({ date: '15/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await server.get('/employees/register-date').query({ date: '19/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await server.get('/employees/register-date').query({ date: '05/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if register date is not passed', async () => {
    const response = await server.get('/employees/register-date').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de data de cadastro é obrigatório'
    })
  })

  it('should get a list of employee by UF', async () => {
    let response = await server.get('/employees/uf').query({ uf: 'AP' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)

    response = await server.get('/employees/uf').query({ uf: 'RS' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(2)

    response = await server.get('/employees/uf').query({ uf: 'PR' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)
  })

  it('should return a error if UF is not passed', async () => {
    const response = await server.get('/employees/uf').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de UF é obrigatório'
    })
  })

  it('should get a list of employee by salary', async () => {
    let response = await server.get('/employees/salary').query({
      min: 8000, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body[0].nome).toBe('Aaron Aaberg')

    response = await server.get('/employees/salary').query({
      min: 5000, max: 6000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body[0].nome).toBe('Aaron Aaby')

    response = await server.get('/employees/salary').query({
      min: 3000, max: 4000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body[0].nome).toBe('Abbie Aagaard')

    response = await server.get('/employees/salary').query({
      min: 0, max: 1000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body[0].nome).toBe('Adan Aarhus')

    response = await server.get('/employees/salary').query({
      min: 5000, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await server.get('/employees/salary').query({
      min: 0, max: 4000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await server.get('/employees/salary').query({
      min: 0, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(4)
  })

  it('should return a error if max is not passed', async () => {
    const response = await server.get('/employees/salary').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Os filtros de faixa salarial são obrigatório'
    })
  })

  it('should return a error if min is not passed', async () => {
    const response = await server.get('/employees/salary').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Os filtros de faixa salarial são obrigatório'
    })
  })

  it('should get a list of employee by status', async () => {
    let response = await server.get('/employees/status').query({ status: Status.ATIVO }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)

    response = await server.get('/employees/status').query({ status: Status.BLOQUEADO }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if status is not passed', async () => {
    const response = await server.get('/employees/status').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de status é obrigatório'
    })
  })
})
