import Mongo from '../database/Mongo'

class EmployeeService {
  public async getEmployeesByName (name: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name)
    const employees = employeesCollection.find({ Nome: nameFilterRegExp }).toArray()
    return employees
  }
}

export default EmployeeService
