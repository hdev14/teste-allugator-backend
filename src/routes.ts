import { Router } from 'express'

import EmployeeController from './controllers/EmployeeController'

const router = Router()

router.get('/employees/name', EmployeeController.getByName)
router.get('/employees/cpf', EmployeeController.getByCPF)
router.get('/employees/role', EmployeeController.getByRole)
router.get('/employees/register-date', EmployeeController.getByRegisterDate)
router.get('/employees/uf', EmployeeController.getByUF)
router.get('/employees/salary', EmployeeController.getBySalary)
router.get('/employees/status', EmployeeController.getByStatus)
router.put('/employees/:id?', EmployeeController.createOrUpdate)

export default router
