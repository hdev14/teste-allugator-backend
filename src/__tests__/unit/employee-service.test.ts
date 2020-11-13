import Mongo from '../../database/Mongo'
import EmployeeService from '../../services/EmployeeService'

describe('EmployeeService Unit Tests', () => {
  beforeAll(async () => {
    // Inicializa o Jest Mongo
    await Mongo.connect(process.env.MONGO_URL || '')
    const employeesCollection = Mongo.getCollection('employees')
    // Dados para teste
    await employeesCollection.insertMany([
      {
        DataCad: '15/04/2017',
        Cargo: 'Dev Jr',
        Cpf: '85235708709',
        Nome: 'Aaron Aaberg',
        UfNasc: 'AP',
        Salario: 8965.30,
        Status: 'ATIVO'
      },
      {
        DataCad: '19/04/2017',
        Cargo: 'AC Sr',
        Cpf: '59984408701',
        Nome: 'Aaron Aaby',
        UfNasc: 'RO',
        Salario: 5312.70,
        Status: 'ATIVO'
      },
      {
        DataCad: '19/04/2017',
        Cargo: 'PO Jr',
        Cpf: '32439637882',
        Nome: 'Abbie Aagaard',
        UfNasc: 'PR',
        Salario: 3655.10,
        Status: 'BLOQUEADO'
      }
    ])
  })

  afterEach(async () => {
    await Mongo.getCollection('news').deleteMany({})
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  it('should return an employee by name', async () => {
    const employeeService = new EmployeeService()

    const employeesWithFirstNameAaron = await employeeService.getEmployeesByName('Aaron')
    expect(employeesWithFirstNameAaron.length).toBe(2)

    const employeesWithFirstNameAbbie = await employeeService.getEmployeesByName('Abbie')
    expect(employeesWithFirstNameAbbie.length).toBe(1)
  })

  it('should return an employee by name', async () => {
    const employeeService = new EmployeeService()

    let employee = await employeeService.getEmployeesByCPF('85235708709')
    expect(employee.Nome).toBe('Aaron Aaberg')

    employee = await employeeService.getEmployeesByCPF('59984408701')
    expect(employee.Nome).toBe('Aaron Aaby')

    employee = await employeeService.getEmployeesByCPF('32439637882')
    expect(employee.Nome).toBe('Abbie Aagaard')
  })
})
