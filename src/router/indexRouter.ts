import { Router } from 'express'
import index_controller from '../controller/indexController'

const router = Router()

// Tie controller function with root path of url(E.g localhost:3000/)
router.get('/', index_controller.getDashboard)

export default router