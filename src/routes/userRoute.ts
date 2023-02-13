import express from 'express'
import * as userController from '../controllers/userController'

const router = express.Router()

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/logout', userController.logoutUser)


export default router