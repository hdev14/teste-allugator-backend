import Mongo from '../database/Mongo'

class EmployeeService {
  public async getEmployeesByName (name: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name, 'i')
    const employees = await employeesCollection.find({ nome: nameFilterRegExp }).toArray()
    return employees
  }

  public async getEmployeeByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employee = await employeesCollection.findOne({ cpf: cpf })
    return employee
  }

  public async getEmployeesByRole (role: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const roleFilterRegExp = new RegExp(role, 'i')
    const employees = await employeesCollection.find({ cargo: roleFilterRegExp }).toArray()
    return employees
  }

  public async getEmployeesByRegisterDate (date: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ datacad: date }).toArray()
    return employees
  }
}

export default EmployeeService
