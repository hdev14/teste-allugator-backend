import 'express-async-errors'
import Mongo from './database/Mongo'
import App from './App'

require('dotenv').config()

Mongo.connect(process.env.MONGO_URL || '').then(() => {
  const server = App.server

  const port = process.env.PORT || 3333
  server.listen(port, () => {
    console.log(`Server is running! -> http://localhost:${port}`)
    console.log(`Api documentation -> http://localhost:${port}/docs`)
  })
}).catch(err => {
  console.error(err)
})
