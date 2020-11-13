import { Request, Response } from 'express'
import EmployeeService from '../services/EmployeeService'

class EmployeeController {
  public async getByName (req: Request, res: Response) {
    const { name } = req.query

    if (!name) {
      return res.status(400).json({
        message: 'O filtro de nome é obrigatório'
      })
    }
    const employees = await EmployeeService.getEmployeesByName(name as string)
    return res.status(200).json(employees)
  }

  public async getByCPF (req: Request, res: Response) {
    const { cpf } = req.query

    if (!cpf) {
      return res.status(400).json({
        message: 'O filtro de cpf é obrigatório'
      })
    }

    const employee = await EmployeeService.getEmployeeByCPF(cpf as string)
    return res.status(200).json(employee)
  }

  public async getByRole (req: Request, res: Response) {
    const { role } = req.query

    if (!role) {
      return res.status(400).json({
        message: 'O filtro de cargo é obrigatório'
      })
    }

    const employees = await EmployeeService.getEmployeesByRole(role as string)
    return res.status(200).json(employees)
  }

  public async getByRegisterDate (req: Request, res: Response) {
    const { date } = req.query
    const employees = await EmployeeService.getEmployeesByRegisterDate(date as string)
    return res.status(200).json(employees)
  }
}

export default new EmployeeController()
