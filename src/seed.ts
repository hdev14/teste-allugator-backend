import Mongo from './database/Mongo'
import { getEmployeesData } from './helpers'

require('dotenv').config()

Mongo.connect(process.env.MONGO_URL || '').then(() => {
  const employeesData = getEmployeesData()
  const employeesCollection = Mongo.getCollection('employees')

  employeesCollection.insertMany(employeesData)
    .then(() => {
      console.log('Seed successfuly')
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}).catch(err => {
  console.error(err)
})
