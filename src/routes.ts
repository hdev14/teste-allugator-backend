import { Router } from 'express'

const router = Router()

router.get('/hello', (req, res) => {
  return res.send('Message')
})

export default router
