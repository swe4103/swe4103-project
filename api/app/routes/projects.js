import express from 'express'

import Roles from '#constants/roles.js'
import {
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '#controllers/projectsController.js'
import { authJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/projects
router.post('/', authJWT, authorizeRoles(Roles.INSTRUCTOR), createProject)

// POST /api/projects/:id
router.get('/:id', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), getProject)

// PUT /api/projects/:id
router.put('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), updateProject)

// DELETE /api/projects/:id
router.delete('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), deleteProject)

export default router
