import express from 'express'

import {
  createTenPoint,
  getTenPoint,
  listTenPoints,
  updateTenPoint,
  deleteTenPoint,
} from '../controllers/joyController.js'

import Roles from '#constants/roles.js'
import { authJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/joy
router.post('/', authJWT, createTenPoint)

// GET /api/joy
router.get('/', authJWT, listTenPoints)

// GET /api/joy/:id
router.get('/:id', authJWT, getTenPoint)

// PUT /api/joy/:id
router.put('/:id', authJWT, updateTenPoint)

// DELETE /api/joy/:id
router.delete('/:id', authJWT, deleteTenPoint)

export default router
