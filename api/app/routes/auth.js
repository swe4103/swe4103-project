import express from 'express'

import { login, logout } from '#controllers/authController.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', login)
// POST /api/auth/logout
router.post('/logout', logout)

export default router
