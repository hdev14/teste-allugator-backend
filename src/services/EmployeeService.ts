import Mongo from '../database/Mongo'

class EmployeeService {
  public async getEmployeesByName (name: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name)
    const employees = await employeesCollection.find({ Nome: nameFilterRegExp }).toArray()
    return employees
  }

  public async getEmployeesByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employee = await employeesCollection.findOne({ Cpf: cpf })
    return employee
  }
}

export default EmployeeService
