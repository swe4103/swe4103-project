import express from 'express'

import authController from '#controllers/authController.js'
import { inviteJWT, authJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', authController.login)
// POST /api/auth/logout
router.post('/logout', authJWT, authController.logout)
// POST /api/auth/register
router.post('/register', inviteJWT, authController.register)

export default router
