import express from 'express'

import {
  createTenPoint,
  getTenPoint,
  listTenPoints,
  updateTenPoint,
  deleteTenPoint,
} from '../controllers/tenPointController.js'

import Roles from '#constants/roles.js'
import { authJWT } from '#middleware/authMiddleware.js'

const router = express.Router()

// POST /api/tenPoint
router.post('/', authJWT, createTenPoint)

// GET /api/tenPoint
router.get('/', authJWT, listTenPoints)

// GET /api/tenPoint/:id
router.get('/:id', authJWT, getTenPoint)

// PUT /api/tenPoint/:id
router.put('/:id', authJWT, updateTenPoint)

// DELETE /api/tenPoint/:id
router.delete('/:id', authJWT, deleteTenPoint)

export default router
