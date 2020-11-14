import { ObjectID } from 'mongodb'
import supertest from 'supertest'

import App from '../../App'
import Mongo from '../../database/Mongo'
import { Status } from '../../types'
import employeesFixtures from '../employees-fixtures.json'

describe('Integration Tests for Employee Endpoints', () => {
  let apiTestClient: supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    // Inicializa o Jest Mongo
    await Mongo.connect(process.env.MONGO_URL || '')
    apiTestClient = supertest(App.server)
  })

  beforeEach(async () => {
    const employeesCollection = Mongo.getCollection('employees')
    await employeesCollection.insertMany(employeesFixtures)
  })

  afterEach(async () => {
    const employeesCollection = Mongo.getCollection('employees')
    await employeesCollection.deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should get a list of employee by name', async () => {
    let response = await apiTestClient.get('/employees/name').query({ name: 'Aaron' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await apiTestClient.get('/employees/name').query({ name: 'Abbie' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if name is not passed', async () => {
    const response = await apiTestClient.get('/employees/name').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de nome é obrigatório'
    })
  })

  it('should get a list of employee by cpf', async () => {
    let response = await apiTestClient.get('/employees/cpf').query({ cpf: '85235708709' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Aaron Aaberg')

    response = await apiTestClient.get('/employees/cpf').query({ cpf: '59984408701' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Aaron Aaby')

    response = await apiTestClient.get('/employees/cpf').query({ cpf: '32439637882' }).send()
    expect(response.status).toBe(200)
    expect(response.body.nome).toBe('Abbie Aagaard')
  })

  it('should return a error if cpf is not passed', async () => {
    const response = await apiTestClient.get('/employees/cpf').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de cpf é obrigatório'
    })
  })

  it('should get a list of employee by role', async () => {
    let response = await apiTestClient.get('/employees/role').query({ role: 'Dev Jr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await apiTestClient.get('/employees/role').query({ role: 'PO Jr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/role').query({ role: 'AC Sr' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if role is not passed', async () => {
    const response = await apiTestClient.get('/employees/role').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de cargo é obrigatório'
    })
  })

  it('should get a list of employee by register date', async () => {
    let response = await apiTestClient.get('/employees/register-date').query({ date: '15/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/register-date').query({ date: '19/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await apiTestClient.get('/employees/register-date').query({ date: '05/04/2017' }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if register date is not passed', async () => {
    const response = await apiTestClient.get('/employees/register-date').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de data de cadastro é obrigatório'
    })
  })

  it('should get a list of employee by UF', async () => {
    let response = await apiTestClient.get('/employees/uf').query({ uf: 'AP' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)

    response = await apiTestClient.get('/employees/uf').query({ uf: 'RS' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(2)

    response = await apiTestClient.get('/employees/uf').query({ uf: 'PR' }).send()
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)
  })

  it('should return a error if UF is not passed', async () => {
    const response = await apiTestClient.get('/employees/uf').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de UF é obrigatório'
    })
  })

  it('should get a list of employee by salary', async () => {
    let response = await apiTestClient.get('/employees/salary').query({
      min: 8000, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/salary').query({
      min: 5000, max: 6000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/salary').query({
      min: 3000, max: 4000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/salary').query({
      min: 0, max: 1000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    response = await apiTestClient.get('/employees/salary').query({
      min: 5000, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await apiTestClient.get('/employees/salary').query({
      min: 0, max: 4000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)

    response = await apiTestClient.get('/employees/salary').query({
      min: 0, max: 9000
    }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(4)
  })

  it('should return a error if max is not passed', async () => {
    const response = await apiTestClient.get('/employees/salary').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Os filtros de faixa salarial são obrigatório'
    })
  })

  it('should return a error if min is not passed', async () => {
    const response = await apiTestClient.get('/employees/salary').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Os filtros de faixa salarial são obrigatório'
    })
  })

  it('should get a list of employee by status', async () => {
    let response = await apiTestClient.get('/employees/status').query({ status: Status.ATIVO }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3)

    response = await apiTestClient.get('/employees/status').query({ status: Status.BLOQUEADO }).send()
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('should return a error if status is not passed', async () => {
    const response = await apiTestClient.get('/employees/status').query({}).send()
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'O filtro de status é obrigatório'
    })
  })

  it('should create an employee', async () => {
    const data = {
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '99999999999',
      nome: 'Test Employee',
      ufnasc: 'RN',
      salario: 8965.30,
      status: Status.ATIVO
    }

    const response = await apiTestClient.put('/employees').send(data)
    expect(response.status).toBe(200)
    expect(response.body._id).toBeTruthy()
  })

  it('should create a new if employee doesnt exists', async () => {
    const fakeId = new ObjectID()
    const data = {
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '99999999999',
      nome: 'Test Employee',
      ufnasc: 'RN',
      salario: 8965.30,
      status: Status.ATIVO
    }

    const response = await apiTestClient.put(`/employees/${fakeId}`).send(data)
    expect(response.status).toBe(200)
    expect(response.body._id).toBeTruthy()
  })

  it('should update an employee', async () => {
    const employee = (await Mongo.getCollection('employees').insertOne({
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '88888888888',
      nome: 'Test Employee',
      ufnasc: 'RN',
      salario: 8965.30,
      status: Status.BLOQUEADO
    })).ops[0]

    const data = {
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '88888888888',
      nome: 'Test Employee Updated',
      ufnasc: 'SP',
      salario: 7000.30,
      status: Status.ATIVO
    }

    const response = await apiTestClient.put(`/employees/${employee._id}`).send(data)
    expect(response.body.datacad).toEqual(data.datacad)
    expect(response.body.cargo).toEqual(data.cargo)
    expect(response.body.cpf).toEqual(data.cpf)
    expect(response.body.nome).toEqual(data.nome)
    expect(response.body.ufnasc).toEqual(data.ufnasc)
    expect(response.body.salario).toEqual(data.salario)
    expect(response.body.status).toEqual(data.status)
  })

  it('should delete an employee', async () => {
    const employee = (await Mongo.getCollection('employees').insertOne({
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '88888888888',
      nome: 'Test Employee',
      ufnasc: 'RN',
      salario: 8965.30,
      status: Status.BLOQUEADO
    })).ops[0]

    const response = await apiTestClient.delete(`/employees/${employee.cpf}`)
    expect(response.status).toBe(204)
  })

  it('should return a error on delete if employee doesnt exist', async () => {
    const fakeCPF = '11111111111'
    const response = await apiTestClient.delete(`/employees/${fakeCPF}`)
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Funcionário não encontrardo'
    })
  })
})
