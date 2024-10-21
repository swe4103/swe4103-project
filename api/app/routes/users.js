import express from 'express'

import Roles from '#constants/roles.js'
import { inviteUsers, getUser, updateUser, deleteUser } from '#controllers/usersController.js'
import { authJWT, inviteJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/users/invite
router.post('/invite', authJWT, authorizeRoles(Roles.INSTRUCTOR, Roles.ADMIN), inviteUsers)

// GET /api/users/:id
router.get('/:id', authJWT, getUser)

// PUT /api/users/:id
router.put('/:id', authJWT, updateUser)

// DELETE /api/users/:id
router.delete('/:id', authJWT, deleteUser)

export default router
