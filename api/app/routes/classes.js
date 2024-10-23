import express from 'express'

import Roles from '#constants/roles.js'
import {
  getClass,
  updateClass,
  deleteClass,
  createClass,
  listClasses,
} from '#controllers/classesController.js'
import { authJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/classes
router.post('/', authJWT, authorizeRoles(Roles.INSTRUCTOR), createClass)

// GET /api/classes
router.get('/', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), listClasses)

// POST /api/classes/:id
router.get('/:id', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), getClass)

// PUT /api/classes/:id
router.put('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), updateClass)

// DELETE /api/classes/:id
router.delete('/:id', authJWT, authorizeRoles(Roles.INSTRUCTOR), deleteClass)

export default router
