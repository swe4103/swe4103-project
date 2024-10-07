import express from 'express'

import authController from '#controllers/authController.js'
import { inviteJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', authController.login)
// POST /api/auth/logout
router.post('/logout', authController.logout)
// POST /api/auth/register
router.post('/register', inviteJWT, authController.register)

export default router
