import express from 'express'

import userController from '#controllers/usersController.js'
import { authJWT, inviteJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/users/invite
router.post('/invite', authJWT, userController.invite)
// POST /api/users/invite/accept
router.post('/invite/accept', [authJWT, inviteJWT], userController.acceptInvite)

export default router
