import { Router } from 'express'

import EmployeeController from './controllers/EmployeeController'

const router = Router()

router.get('/employees/name', EmployeeController.getByName)
router.get('/employees/cpf', EmployeeController.getByCPF)

export default router
