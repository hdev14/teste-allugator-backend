import { ObjectID } from 'mongodb'
import Mongo from '../database/Mongo'

import { EmployeeData, Status } from '../types'

class EmployeeService {
  public static async getEmployeesByName (name: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name, 'i')
    const employees = await employeesCollection.find({ nome: nameFilterRegExp }).toArray()

    return employees
  }

  public static async getEmployeeByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employee = await employeesCollection.findOne({ cpf: cpf })

    return employee
  }

  public static async getEmployeesByRole (role: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const roleFilterRegExp = new RegExp(role, 'i')
    const employees = await employeesCollection.find({ cargo: roleFilterRegExp }).toArray()

    return employees
  }

  public static async getEmployeesByRegisterDate (date: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ datacad: date }).toArray()

    return employees
  }

  public static async getEmployeesGroupedByUF (uf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { ufnasc: uf } }
    ]).toArray()

    return {
      employees,
      count: employees.length
    }
  }

  public static async getEmployeesBySalary (min: number, max: number) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { salario: { $gte: min, $lte: max } } }
    ]).toArray()

    return employees
  }

  public static async getEmployeesByStatus (status: Status) {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ status: status }).toArray()

    return employees
  }

  public static async createOrUpdateEmployee (employeeData: EmployeeData, id: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const result = await employeesCollection.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: employeeData },
      { upsert: true, returnOriginal: false }
    )

    return result.value
  }

  public static async deleteEmployeeByCPF (cpf: string) {
    const employeesCollection = Mongo.getCollection('employees')
    const result = await employeesCollection.findOneAndDelete({ cpf: cpf })

    return result.ok && result.lastErrorObject.n > 0
  }
}

export default EmployeeService
