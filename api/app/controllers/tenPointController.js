import { tenPointSchema, updateTenPointSchema, tenPointsQuerySchema } from '#schemas/tenPoint.js'
import {
  createTenPoint,
  getTenPointById,
  updateTenPointById,
  deleteTenPointById,
  listTenPoints,
} from '#services/tenPointService.js'

export const listTenPointRatings = async (req, res) => {
  const { error, value } = tenPointsQuerySchema.validate(req.query, { stripUnknown: true })
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const tenPoints = await listTenPoints(value)
    if (!tenPoints) {
      return res.status(404).json({ message: 'No 10-point distributions found' })
    }
    return res.status(200).json(ratings)
  } catch (error) {
    console.error('Error fetching 10-point distributions:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTenPoint = async (req, res) => {
  const { id } = req.params
  try {
    const tenPoint = await getTenPointById(id)
    if (!tenPoint) {
      return res.status(404).json({ message: '10-point rating not found' })
    }
    return res.status(200).json(tenPoint)
  } catch (error) {
    console.error('Error retrieving 10-point distribution: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const createTenPointRating = async (req, res) => {
  const { error, value } = tenPointSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const tenPoint = createTenPoint(value)
    return res.status(201).json(tenPoint)
  } catch (error) {
    console.error('Error creating 10-point distribution: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTenPoint = async (req, res) => {
  const { id } = req.params

  const { error, value } = updateTenPointSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const updateTenPoint = await updateTenPointById(id, value)
    if (!updateTenPoint) {
      return res.status(404).json({ message: '10-point rating not found' })
    }
    return res.status(200).json(updateTenPoint)
  } catch (error) {
    console.error('Error updating 10-point distribution: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteTenPoint = async (req, res) => {
  const { id } = req.params
  try {
    const deletedID = await deleteTenPointById(id)
    if (!deletedId) {
      return res.status(404).json({ message: '10-point rating not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting 10-point distibution: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
