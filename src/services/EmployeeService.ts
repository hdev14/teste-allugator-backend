import Mongo from '../database/Mongo'

class EmployeeService {
  public async getEmployeesByName (name: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name)
    const employees = await employeesCollection.find({ nome: nameFilterRegExp }).toArray()
    return employees
  }

  public async getEmployeeByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employee = await employeesCollection.findOne({ cpf: cpf })
    return employee
  }
}

export default EmployeeService
