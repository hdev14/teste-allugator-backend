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
        datacad: '15/04/2017',
        cargo: 'Dev Jr',
        cpf: '85235708709',
        nome: 'Aaron Aaberg',
        ufnasc: 'AP',
        salario: 8965.30,
        status: 'ATIVO'
      },
      {
        datacad: '19/04/2017',
        cargo: 'AC Sr',
        cpf: '59984408701',
        nome: 'Aaron Aaby',
        ufnasc: 'RO',
        salario: 5312.70,
        status: 'ATIVO'
      },
      {
        datacad: '19/04/2017',
        cargo: 'PO Jr',
        cpf: '32439637882',
        nome: 'Abbie Aagaard',
        ufnasc: 'PR',
        salario: 3655.10,
        status: 'BLOQUEADO'
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

    let employee = await employeeService.getEmployeeByCPF('85235708709')
    expect(employee.nome).toBe('Aaron Aaberg')

    employee = await employeeService.getEmployeeByCPF('59984408701')
    expect(employee.nome).toBe('Aaron Aaby')

    employee = await employeeService.getEmployeeByCPF('32439637882')
    expect(employee.nome).toBe('Abbie Aagaard')
  })
})
