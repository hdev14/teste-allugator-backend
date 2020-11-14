import { Router } from 'express'
import swaggerDocs from './swaggerDocs'
import swaggerUi from 'swagger-ui-express'

import EmployeeController from './controllers/EmployeeController'

const router = Router()

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

/**
 * @swagger
 *
 * definitions:
 *  Employee:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      datacad:
 *        type: string
 *      cargo:
 *        type: string
 *      cpf:
 *        type: string
 *      nome:
 *        type: string
 *      salario:
 *        type: number
 *        format: float
 *      status:
 *        type: string
 *  NewEmployee:
 *    type: object
 *    properties:
 *      datacad:
 *        type: string
 *      cargo:
 *        type: string
 *      cpf:
 *        type: string
 *      nome:
 *        type: string
 *      salario:
 *        type: number
 *        format: float
 *      status:
 *        type: string
 */

/**
 * @swagger
 * /employees/name:
 *  get:
 *    description: Serviço para consultar funcionários por nome.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: name
 *        in: query
 *        description: Nome do funcionário.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/name', EmployeeController.getByName)

/**
 * @swagger
 * /employees/cpf:
 *  get:
 *    description: Serviço para consultar funcionários por CPF.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: cpf
 *        in: query
 *        description: CPF do funcionário (apenas números).
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/cpf', EmployeeController.getByCPF)

/**
 * @swagger
 * /employees/role:
 *  get:
 *    description: Serviço para consultar funcionários por cargo.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: role
 *        in: query
 *        description: Cargo do funcionário.
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/role', EmployeeController.getByRole)

/**
 * @swagger
 * /employees/register-date:
 *  get:
 *    description: Serviço para consultar funcionários por data de cadastro.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: date
 *        in: query
 *        description: Data de cadastro no formato "DD/MM/AAAA".
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/register-date', EmployeeController.getByRegisterDate)

/**
 * @swagger
 * /employees/uf:
 *  get:
 *    description: Serviço para consultar funcionários por UF de nascimento.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: uf
 *        in: query
 *        description: UF de nascimento do funcionário (Sigla em letra maiúsculas).
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/uf', EmployeeController.getByUF)

/**
 * @swagger
 * /employees/salary:
 *  get:
 *    description: Serviço para consultar funcionários por faixa salarial.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: min
 *        in: query
 *        description: Valor mínimo da faixa salarial
 *        required: true
 *        schema:
 *          type: number
 *          format: float
 *      - name: max
 *        in: query
 *        description: Valor max da faixa salarial
 *        required: true
 *        schema:
 *          type: number
 *          format: float
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/salary', EmployeeController.getBySalary)

/**
 * @swagger
 * /employees/status:
 *  get:
 *    description: Serviço para consultar funcionários por status.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: status
 *        in: query
 *        description: Status do funcionário podendo ser "ATIVO" ou "BLOQUEADO".
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Employee'
 */
router.get('/employees/status', EmployeeController.getByStatus)

/**
 * @swagger
 * /employees/{id?}:
 *  put:
 *    description: Serviço para cadastrar ou atualizar um funcionário.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID do funcionário
 *        required: false
 *        schema:
 *          type: string
 *      - name: employee
 *        in: body
 *        description: Objeto de funcionário.
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/NewEmployee'
 *    responses:
 *      '200':
 *        description: Resposta de sucesso
 *        schema:
 *          $ref: '#/definitions/Employee'
 */
router.put('/employees/:id?', EmployeeController.createOrUpdate)

/**
 * @swagger
 * /employees/{cpf}:
 *  delete:
 *    description: Serviço para excluir um funcionário pelo CPF.
 *    parameters:
 *      - name: cpf
 *        in: path
 *        description: CPF do funcionário
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '204':
 *        description: Resposta de sucesso
 *      '400':
 *        description: Funcionário não encontrato
 */
router.delete('/employees/:cpf', EmployeeController.delete)

export default router
