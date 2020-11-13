import Mongo from '../../database/Mongo'
import EmployeeService from '../../services/EmployeeService'
import employeesFixture from '../employees-fixture.json'

import { EmployeeData, Status } from '../../types'

describe('EmployeeService Unit Tests', () => {
  beforeAll(async () => {
    // Inicializa o Jest Mongo
    await Mongo.connect(process.env.MONGO_URL || '')
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

  it('should return a list of employee by name', async () => {
    const employeesWithFirstNameAaron = await EmployeeService.getEmployeesByName('Aaron')
    expect(employeesWithFirstNameAaron.length).toBe(2)

    const employeesWithFirstNameAbbie = await EmployeeService.getEmployeesByName('Abbie')
    expect(employeesWithFirstNameAbbie.length).toBe(1)
  })

  it('should return an employee by cpf', async () => {
    let employee = await EmployeeService.getEmployeeByCPF('85235708709')
    expect(employee.nome).toBe('Aaron Aaberg')

    employee = await EmployeeService.getEmployeeByCPF('59984408701')
    expect(employee.nome).toBe('Aaron Aaby')

    employee = await EmployeeService.getEmployeeByCPF('32439637882')
    expect(employee.nome).toBe('Abbie Aagaard')
  })

  it('should return a list of employees by role', async () => {
    const employeesWithRoleDevJr = await EmployeeService.getEmployeesByRole('Dev Jr')
    expect(employeesWithRoleDevJr.length).toBe(2)

    const employeesWithRolePOJr = await EmployeeService.getEmployeesByRole('PO Jr')
    expect(employeesWithRolePOJr.length).toBe(1)

    const employeesWithRoleACSr = await EmployeeService.getEmployeesByRole('AC Sr')
    expect(employeesWithRolePOJr.length).toBe(1)
  })

  it('should return a list of employees by register date', async () => {
    let employees = await EmployeeService.getEmployeesByRegisterDate('15/04/2017')
    expect(employees.length).toBe(1)

    employees = await EmployeeService.getEmployeesByRegisterDate('19/04/2017')
    expect(employees.length).toBe(2)

    employees = await EmployeeService.getEmployeesByRegisterDate('05/04/2017')
    expect(employees.length).toBe(1)
  })

  it('should return a list of employees grouped by UF', async () => {
    let employeesData = await EmployeeService.getEmployeesGroupedByUF('AP')
    expect(employeesData.employees).toBeTruthy()
    expect(employeesData.count).toBe(1)

    employeesData = await EmployeeService.getEmployeesGroupedByUF('RS')
    expect(employeesData.employees).toBeTruthy()
    expect(employeesData.count).toBe(2)

    employeesData = await EmployeeService.getEmployeesGroupedByUF('PR')
    expect(employeesData.employees).toBeTruthy()
    expect(employeesData.count).toBe(1)
  })

  it('should return a list of employees by salary', async () => {
    let employees = await EmployeeService.getEmployeesBySalary(8000, 9000)
    expect(employees[0].nome).toBe('Aaron Aaberg')

    employees = await EmployeeService.getEmployeesBySalary(5000, 6000)
    expect(employees[0].nome).toBe('Aaron Aaby')

    employees = await EmployeeService.getEmployeesBySalary(3000, 4000)
    expect(employees[0].nome).toBe('Abbie Aagaard')

    employees = await EmployeeService.getEmployeesBySalary(0, 1000)
    expect(employees[0].nome).toBe('Adan Aarhus')

    employees = await EmployeeService.getEmployeesBySalary(5000, 9000)
    expect(employees.length).toBe(2)

    employees = await EmployeeService.getEmployeesBySalary(0, 4000)
    expect(employees.length).toBe(2)

    employees = await EmployeeService.getEmployeesBySalary(0, 9000)
    expect(employees.length).toBe(4)
  })

  it('should return a list of employees by status', async () => {
    let employees = await EmployeeService.getEmployeesByStatus(Status.ATIVO)
    expect(employees.length).toBe(3)

    employees = await EmployeeService.getEmployeesByStatus(Status.BLOQUEADO)
    expect(employees.length).toBe(1)
  })

  it('should create an employee', async () => {
    const employeeData: EmployeeData = {
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '99999999999',
      nome: 'Test Employee',
      ufnasc: 'RN',
      salario: 8965.30,
      status: Status.ATIVO
    }

    const newEmployee = await EmployeeService.createOrUpdateEmployee(employeeData, null)
    expect(newEmployee._id).toBeTruthy()
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

    const employeeUpdateData: EmployeeData = {
      datacad: '13/11/2020',
      cargo: 'Dev Jr',
      cpf: '88888888888',
      nome: 'Test Employee Updated',
      ufnasc: 'SP',
      salario: 7000.30,
      status: Status.ATIVO
    }

    const updatedEmployee = await EmployeeService.createOrUpdateEmployee(employeeUpdateData, employee._id)
    expect(updatedEmployee.datacad).toEqual(employeeUpdateData.datacad)
    expect(updatedEmployee.cargo).toEqual(employeeUpdateData.cargo)
    expect(updatedEmployee.cpf).toEqual(employeeUpdateData.cpf)
    expect(updatedEmployee.nome).toEqual(employeeUpdateData.nome)
    expect(updatedEmployee.ufnasc).toEqual(employeeUpdateData.ufnasc)
    expect(updatedEmployee.salario).toEqual(employeeUpdateData.salario)
    expect(updatedEmployee.status).toEqual(employeeUpdateData.status)
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

    const result = await EmployeeService.deleteEmployeeByCPF(employee.cpf)
    expect(result).toBe(true)
  })
})
