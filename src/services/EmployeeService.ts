import { ObjectID } from 'mongodb'

import Mongo from '../database/Mongo'
import { EmployeeData, Status } from '../types'

class EmployeeService {
  public static async getEmployeesByName (name: string): Promise<EmployeeData[]> {
    const employeesCollection = Mongo.getCollection('employees')
    const nameFilterRegExp = new RegExp(name, 'i')
    const employees = await employeesCollection.find({ nome: nameFilterRegExp }).toArray()

    return employees
  }

  public static async getEmployeeByCPF (cpf: string): Promise<EmployeeData> {
    const employeesCollection = Mongo.getCollection('employees')
    const employee = await employeesCollection.findOne({ cpf: cpf })

    return employee
  }

  public static async getEmployeesByRole (role: string): Promise<EmployeeData[]> {
    const employeesCollection = Mongo.getCollection('employees')
    const roleFilterRegExp = new RegExp(role, 'i')
    const employees = await employeesCollection.find({ cargo: roleFilterRegExp }).toArray()

    return employees
  }

  public static async getEmployeesByRegisterDate (date: string): Promise<EmployeeData[]> {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ datacad: date }).toArray()

    return employees
  }

  public static async getEmployeesGroupedByUF (uf: string): Promise<{ employees: EmployeeData[], count: number}> {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { ufnasc: uf } }
    ]).toArray()

    return {
      employees,
      count: employees.length
    }
  }

  public static async getEmployeesBySalary (min: number, max: number): Promise<EmployeeData[]> {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.aggregate([
      { $match: { salario: { $gte: min, $lte: max } } }
    ]).toArray()

    return employees
  }

  public static async getEmployeesByStatus (status: Status): Promise<EmployeeData[]> {
    const employeesCollection = Mongo.getCollection('employees')
    const employees = await employeesCollection.find({ status: status }).toArray()

    return employees
  }

  public static async createOrUpdateEmployee (employeeData: EmployeeData, id: string): Promise<EmployeeData> {
    const employeesCollection = Mongo.getCollection('employees')
    const result = await employeesCollection.findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: employeeData },
      { upsert: true, returnOriginal: false }
    )

    return result.value
  }

  public static async deleteEmployeeByCPF (cpf: string): Promise<boolean> {
    const employeesCollection = Mongo.getCollection('employees')
    const result = await employeesCollection.findOneAndDelete({ cpf })

    return (result.ok && result.lastErrorObject.n > 0)
  }
}

export default EmployeeService
