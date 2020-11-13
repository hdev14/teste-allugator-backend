import { ObjectID } from 'mongodb'
import Mongo from '../database/Mongo'

import { EmployeeData, Status } from '../types'

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

  public async getEmployeesByStatus (status: Status) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ status: status }).toArray()
    return employees
  }

  public async createOrUpdateEmployee (employeeData: EmployeeData, id: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const result = await employeesCollection.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: employeeData },
      { upsert: true, returnOriginal: false }
    )

    return result.value
  }

  public async deleteEmployeeByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const { result } = await employeesCollection.deleteOne({ cpf })

    return result.ok && result.n > 0
  }
}

export default EmployeeService
