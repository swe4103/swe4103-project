import express from 'express'

import {
  createJoyRating,
  getJoyRating,
  listJoyRatings,
  updateJoyRating,
  deleteJoyRating,
} from '../controllers/joyController.js'

import Roles from '#constants/roles.js'
import { authJWT } from '#middleware/authMiddleware.js'
import { authorizeRoles } from '#middleware/roleMiddleware.js'

const router = express.Router()

// POST /api/joy
router.post('/', authJWT, authorizeRoles(Roles.STUDENT), createJoyRating)

// GET /api/joy
router.get('/', authJWT, authorizeRoles(Roles.STUDENT, Roles.INSTRUCTOR), listJoyRatings)

// GET /api/joy/:id
router.get('/:id', authJWT, authorizeRoles(Roles.STUDENT), getJoyRating)

// PUT /api/joy/:id
router.put('/:id', authJWT, authorizeRoles(Roles.STUDENT), updateJoyRating)

// DELETE /api/joy/:id
router.delete('/:id', authJWT, authorizeRoles(Roles.STUDENT), deleteJoyRating)

export default router
