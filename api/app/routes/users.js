import express from 'express'

import Roles from '#constants/roles.js'
import { invite } from '#controllers/usersController.js'
import { authJWT, inviteJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/users/invite
router.post('/invite', authJWT, authorizeRoles(Roles.INSTRUCTOR, Roles.ADMIN), invite)

export default router
