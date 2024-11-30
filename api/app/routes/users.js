import express from 'express'

import Roles from '#constants/roles.js'
import { inviteUsers, getUser, updateUser, deleteUser } from '#controllers/usersController.js'
import { authJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'
import { changePassword } from '../controllers/usersController.js';


const router = express.Router()

// POST /api/users/invite
router.post('/invite', authJWT, authorizeRoles(Roles.INSTRUCTOR, Roles.ADMIN), inviteUsers)

// GET /api/users/:id
router.get('/:id', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), getUser)

// PUT /api/users/:id
router.put('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), updateUser)

// DELETE /api/users/:id
router.delete('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), deleteUser)

// Add route for password change
router.put('/:id/change-password', changePassword);

export default router
