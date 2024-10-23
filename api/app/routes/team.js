import express from 'express'

import Roles from '#constants/roles.js'
import { getTeam } from '#controllers/TeamController.js'
import { authJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/classes
// router.post('/', authJWT, authorizeRoles(Roles.INSTRUCTOR), createClass)

// POST /api/classes/:id
router.get('/:id', authJWT, getTeam)

export default router
