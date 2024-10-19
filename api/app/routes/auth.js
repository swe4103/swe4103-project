import express from 'express'

import { login, logout, register } from '#controllers/authController.js'
import { inviteJWT, authJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', login)
// POST /api/auth/logout
router.post('/logout', authJWT, logout)
// POST /api/auth/register
router.post('/register', inviteJWT, register)

export default router
