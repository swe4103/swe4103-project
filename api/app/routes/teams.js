import express from 'express'

import Roles from '#constants/roles.js'
import {
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  listTeams,
} from '#controllers/teamsController.js'
import { authJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/teams
router.post('/', authJWT, authorizeRoles(Roles.INSTRUCTOR), createTeam)

// POST /api/teams/:id
router.get('/:id', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), getTeam)

//POST /api/teams
router.get('/', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), listTeams)

// PUT /api/teams/:id
router.put('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), updateTeam)

// DELETE /api/teams/:id
router.delete('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), deleteTeam)

export default router
