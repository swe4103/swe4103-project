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

const router = express.Router()

// POST /api/joy
router.post('/', authJWT, createJoyRating)

// GET /api/joy
router.get('/', authJWT, listJoyRatings)

// GET /api/joy/:id
router.get('/:id', authJWT, getJoyRating)

// PUT /api/joy/:id
router.put('/:id', authJWT, updateJoyRating)

// DELETE /api/joy/:id
router.delete('/:id', authJWT, deleteJoyRating)

export default router
