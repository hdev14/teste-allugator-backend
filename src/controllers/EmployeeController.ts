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
    const employee = await EmployeeService.getEmployeeByCPF(cpf as string)
    return res.status(200).json(employee)
  }
}

export default new EmployeeController()