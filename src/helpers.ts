import fs from 'fs'
import { resolve } from 'path'

export function getEmployeesData () {
  const fileContent = fs.readFileSync(
    resolve(__dirname, 'employees.txt'),
    { encoding: 'utf-8', flag: 'r' }
  )

  const lines = fileContent.split('\n')
  const headers = lines[0].split(';')

  const data = []

  for (let i = 0; i < headers.length; i++) {
    const columnHeader = headers[i].toLocaleLowerCase()

    for (let j = 1; j < lines.length; j++) {
      const columnValue = columnHeader === 'salario'
        ? Number(lines[j].split(';')[i])
        : lines[j].split(';')[i]

      const dataIndex = j - 1

      if (data[dataIndex]) {
        data[dataIndex] = {
          ...data[dataIndex],
          [columnHeader]: columnValue
        }
        continue
      }

      data[dataIndex] = { [columnHeader]: columnValue }
    }
  }

  return data
}
