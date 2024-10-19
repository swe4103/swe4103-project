import express from 'express'

import { invite } from '#controllers/usersController.js'
import { authJWT, inviteJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/users/invite
router.post('/invite', authJWT, invite)

export default router
