import Mongo from '../database/Mongo'
import { getEmployeesData } from '../helpers'

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

  public async getEmployeesGroupedByUF (uf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { ufnasc: uf } }
    ]).toArray()
    return {
      employees,
      count: employees.length
    }
  }

  public async getEmployeesBySalary (min: number, max: number) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { salario: { $gt: min, $lt: max } } }
    ]).toArray()
    return employees
  }
}

export default EmployeeService
